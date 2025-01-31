--- 
title: "Rubik's Cube Rig Using Custom node"
date: "October 25, 2024"
category: "articles"
tags: ["MayaAPI", "Python", "Rig"]
thumbnail: "https://images.unsplash.com/photo-1640958899763-9b5b4d9e4b6c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
alt: "Rubik's cube rig"
excerpt: "This is the excerpt"
---

<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7265333089051041792?compact=1" height="399" width="700" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>

> Before start reading, It is recommended to watch the video above to get a general idea of the rig

## Introduction

It might seem easy to rig a Rubik's cube, but actually there is a major problem with the parenting system. To be able to create a fully functional Rubik's cube rig, we need to change the parent for each cube every time it rotates. It gets even more complicated if we want to undo/redo or preview the animation, because then we need to track all the history of parent operation.

There are some options to rig a Rubik's Cube like using an external UI or function callback to handle all the calculations behind, but I haven't found one that fully animation-ready. However, I came up with the idea of using a custom node because it is natively integrated with some important functionality like [dirty propagation](https://help.autodesk.com/view/MAYAUL/2024/ENU/?guid=Maya_SDK_Dependency_graph_plug_ins_DirtyPropagation_html).

This article will not cover the whole process of creating a 100% ready-to-use Rubik's cube rig neither custom node, but it will cover the general principle of the Rubik's cube rig. The reason being is covering the whole process is very long and complicated and I want to make this article easier to understand for all the readers.

## Creating our custom node

By extending the Maya API <CodeText>MpxNode</CodeText> class, we can create our custom node. But first, let's plan what we will need! In this rig we need to have locators that hold the global space of each cube position. The next thing we need is the control because we want to pair each control with its corresponding locator so whenever the control is rotated the matching locator will try to find which joint to transform. Lastly, we need to have a set of outputs for the joints, so we can transform the calculation data to the joint.

Let's say we are going to make a 2x2 Rubik's node. Therefore, we need 8 inputs for the locator on each cube, 4 inputs for control on each axis including the negative, and 8 joint input outputs.


```py
# testing
import maya.api.OpenMaya as om2

class RubikNode2x2(om2.MPxNode):
    def __init__(self):
        om2.MPxNode.__init__(self)          

    @classmethod
    def initialize(self):
        # create attribute
        for count in range(4):
            self.ctrl_input[count] = self.create_attribute('ctrl', 'c', str(count+1))
        for count in range(8):
            self.loc_input[count] = self.create_attribute('loc', 'l', str(count+1))
            self.jnt_input[count] = self.create_attribute('jnt_ws', 'jw', str(count+1))
            self.jnt_output[count] = self.create_attribute('jnt_m', 'jm', str(count+1), False)

        # attach attribute to node 
        for attr in self.ctrl_input + self.loc_input + self.jnt_input + self.jnt_output:
            self.addAttribute(attr)

        # connect the circuitry 
        for ctrl_attr in self.ctrl_input:
            for jnt_attr in self.jnt_output:
                self.attributeAffects(ctrl_attr, jnt_attr) 
```

MpxNode class has a virtual function named <CodeText>compute</CodeText> that should be overridden in user-defined nodes. This function will automatically recompute the given output from the node's inputs. Every time Maya calls this function we get a <CodeText>plug</CodeText> and <CodeText>dataBlock</CodeText> argument that we can process to calculate the outputs.

Every time there is a rotation, we want to update the data for all the joint matrices. Maya API doesn't give a direct way to get the rotation degrees from the transform matrix, so we will need to convert it as follows.

```py
 def compute(self,plug,data):  
    if plug in self.jnt_output:
        current_rotate_value = []
        for index,input in enumerate(self.ctrl_input):
            attr_trans_mtx = om2.MTransformationMatrix(data.inputValue(input).asMatrix())
            attr_euler = attr_trans_mtx.rotation(asQuaternion=False)
            attr_rot_list = [math.degrees(attr_euler.x), math.degrees(attr_euler.y), math.degrees(attr_euler.z)]
            attr_rot = attr_rot_list[self.rotation_axis[index]]
            current_rotate_value.append(attr_rot)
        self.updateRotationData(current_rotate_value) # we need to define it first
```

Next, inside the compute function we update the joint matrices data using <CodeText>updateRotationData</CodeText> function.

```py
def updateRotationData(self, current_rotate_value): 
    for index,rotate_value in enumerate(current_rotate_value):
        if not isclose(rotate_value, self.stored_ctrl_attr_value[index]):
            if self.ctrl_input[index] not in self.active_ctrl:
                jnt_attr_list, jnt_mtx_list = self.find_closest_joint(self.ctrl_input[index])  # find closest joint from global space
                self.active_ctrl.append(self.ctrl_input[index]) 
                self.active_jnts.append(jnt_attr_list)
                self.active_jnt_mtx.append(jnt_mtx_list)
            elif self.ctrl_input[index] in self.active_ctrl:
                if self.ctrl_input[index] not in self.active_ctrl_to_remove: self.active_ctrl_to_remove.append(self.ctrl_input[index])  
```

Inside the Rubik's cube node, we need to have some variable to hold the current active control, so within <CodeText>updateRotationData</CodeText> we can determine if the control should be active or not.

Back to the <CodeText>compute</CodeText> function after we already have the active control, we can decide whether to proceed with rotating the Rubik's cube or not 

> remember that the following code is the continuation of the existing <CodeText>compute</CodeText> function

```py
if self.active_ctrl:
    for ctrl_attr in self.active_ctrl:
        for jnt_index, jnt_attr in enumerate(self.active_jnts[self.active_ctrl.index(ctrl_attr)]):
            matrix = self.active_jnt_mtx[self.active_ctrl.index(ctrl_attr)][jnt_index]

            output_matrix = matrix * data.inputValue(ctrl_attr).asMatrix() * self.active_ctrl_mtx[self.ctrl_input.index(ctrl_attr)].inverse()

            handler = data.outputValue(self.jnt_output[self.jnt_input.index(jnt_attr)])  
            handler.setMMatrix(output_matrix)
            handler.setClean()
```

Here is the most important section, calculating the output matrix. The formula is similar to basic matrix transformation, <CodeText>matrix</CodeText> \* <CodeText>active control matrix</CodeText> \* <CodeText>inverse active control matrix</CodeText>. We got all this data from the node's variable. Don't forget to set and clean the handler for the corresponding output plug, it will tell Maya that the operation is complete and clean.

## Using the Rubik's cube node

After all the hard work is already done, now it's time to connect all the inputs. Let's first start with connecting the controls! In the Maya scene I already set up the rigging system including the joints, locators, and controls. These should be at the same position with each cube, so Rubik's cube node can detect the closest joint.

![Rubik Rig Setup](/images/portofolio/rubik_stripping.gif "Rubik Rig Setup")

Now we need to connect each control and locator with the corresponding input. In this example, we are using a 3x3 Rubik's cube with a total of 9 controls and 27 locators, so it will get a little too repetitive to set up. To speed up the process, I already created a script that automatically connects all the controls and locators.

```py
import maya.cmds as cmds

RUBIK_NODE_NAME = "Rubik3x3Node1"
cmds.shadingNode("Rubik3x3Node", au=1)

cmds.connectAttr('X_plus_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp1.ctrl1",f=1)
cmds.connectAttr('X_mid_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp2.ctrl2",f=1)
cmds.connectAttr('X_minus_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp3.ctrl3",f=1)
cmds.connectAttr('Y_plus_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp4.ctrl4",f=1)
cmds.connectAttr('Y_mid_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp5.ctrl5",f=1)
cmds.connectAttr('Y_minus_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp6.ctrl6",f=1)
cmds.connectAttr('Z_plus_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp7.ctrl7",f=1)
cmds.connectAttr('Z_mid_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp8.ctrl8",f=1)
cmds.connectAttr('Z_minus_ctrl.matrix', RUBIK_NODE_NAME+".ctrl_grp9.ctrl9",f=1)

# x plus
cmds.connectAttr('Cube7_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc1",f=1)
cmds.connectAttr('Cube8_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc2",f=1)
cmds.connectAttr('Cube9_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc3",f=1)
cmds.connectAttr('Cube16_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc4",f=1)
cmds.connectAttr('Cube17_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc5",f=1)
cmds.connectAttr('Cube18_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc6",f=1)
cmds.connectAttr('Cube25_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc7",f=1)
cmds.connectAttr('Cube26_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc8",f=1)
cmds.connectAttr('Cube27_loc.matrix', RUBIK_NODE_NAME+".ctrl_grp1.loc9",f=1)

# x minus and so on...
```

> Note that this script is hard coded so you need to adjust the name with you controls and locators name.

Because joints will be connected for both inputs and outputs, it can create a <CodeText>cycle warning</CodeText>. Fortunately, we only need the joint input as an initial value, so we can disconnect it right after we connect it. So for this, if we want to automate the process using script we can create two functions and execute them separately.

```py
def connect_jnt():
    for i in range(1,28):
        cmds.connectAttr("Cube%s_jnt.matrix"%i, RUBIK_NODE_NAME+".jnt_in_grp.jnt_ws%s"%i, f=1)

connect_jnt()   # execute this function first

def disconnect_attr():
    for i in range(1,28):
        cmds.disconnectAttr("Cube%s_jnt.matrix"%i, RUBIK_NODE_NAME+".jnt_in_grp.jnt_ws%s"%i)

disconnect_attr()   # finally, execute this function
```

Rubik's cube node outputs a matrix unit, so if we want to transform the joint we need to convert the matrix to a translation and rotation unit. You can modify the Rubik's cube node to convert this process internally, but in this example, we will need some help from <CodeText>decomposeMatrix</CodeText> node. Connect the output joint matrix to the <CodeText>input Matrix</CodeText> in <CodeText>decomposeMatrix</CodeText> node and connect the <CodeText>Output Rotate</CodeText> and <CodeText>Output Translate</CodeText> to the target joint transformation.

![Connect joint matrix to decompose matrix](/images/portofolio/decompose_mtx.gif "Connect joint matrix to decompose matrix")

> If you want to automate this process you can do that using some basic scripting like this.

```py
def connect_decomposeMtx():
    for i in range(1,28):
        decompose = cmds.shadingNode('decomposeMatrix', au=1)
        cmds.connectAttr(RUBIK_NODE_NAME+".jnt_m%s"%i, decompose+".inputMatrix", f=1)
        cmds.connectAttr('decomposeMatrix%s'%i+".outputTranslate", "Cube%s_jnt.translate"%i, f=1)
        cmds.connectAttr('decomposeMatrix%s'%i+".outputRotate", "Cube%s_jnt.rotate"%i, f=1)
        
connect_decomposeMtx()
```

![final_nodes_setup](/images/portofolio/final_node_rubik.gif "Final nodes setup")

## Closing words

And that's pretty much it! I know it's not a comprehensive tutorial, but this is the general step I used to rig the Rubik's cube. Using this setup we don't need to deal with external tools and the best thing is we can use it for animation while Maya still keeps track of undo/redo. Even though the node setup might look complicated, this rig is still lightweight and interactive.

![playing_rubik_cube_rig](/images/portofolio/rubik_play.gif "Playing Rubik's Cube Rig")

> This rig tested in Maya 2020.4 (python 2.7)

I hope you get something from this article and I will share any knowledge I found on the other post regarding this rig or technical art in general. Cheers! 😁