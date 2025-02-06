--- 
title: 'Creating Position Based Constraint'
date: "March 22, 2024"
category: "articles"
tags: ["Python"]
thumbnail: /images/portofolio/pos_constraint_thumbnail.PNG
alt: "Position Constraint Tool"
excerpt: "This is the excerpt"
---

## Background
Sometimes there is a situation where I want to constrain a set of parents to a set of children according to their world space location, for example, when I have 2 skeleton chains, driver skeleton and driven skeleton. Usually what I did was constrain each driven skeleton to the driver skeleton, but it takes a huge amount of time since the skeleton usually contains hundreds of joints.

In this article, we will be looking into the process of creating the Position Constraint Tool. This tool will help us constrain between two sets of objects (usually parent and child) according to their world location. To better understand this article, the reader is expected to have some experience with Python and Maya commands.

> You can check out the full script at the bottom of this article. 

## Designing the data structure
 
The main recipe for this tool is using Python [Dictionary](https://docs.python.org/3/tutorial/datastructures.html#dictionaries). We will be searching through the key from the parent dictionary and checking if the child dictionary has the same key, and then we can get the object name from each dictionary. The dictionary key will be the world space location, and the value will be the object name. To illustrate what I mean, let's look at the diagram below.

![Dictionary Visualization](/images/portofolio/dict_pos_constraint.gif "Dictionary Visualization")

To get the world space location for each object, we will query it using [xfrom](https://download.autodesk.com/us/maya/2009help/CommandsPython/xform.html) from Maya command and for the object name, I prefer to use a <CodeText>long</CodeText> flag inside [ls](https://help.autodesk.com/cloudhelp/ENU/MayaCRE-Tech-Docs/CommandsPython/ls.html) command to avoid duplicated names.

## Storing the vector position

Let's look at these functions called <CodeText>store_vector</CodeText> and <CodeText>store_dict_vector</CodeText>. 

```py
def store_vector(self, obj, decimal_amount=2):
    selection = obj
    vector_dict = {}
    for obj in selection:
        truncated_pos = []
        pos = cmds.xform(obj, q=1, ws=1, t=1)
        for point in pos:
            truncated_pos.append(self.truncate(point, decimal_amount))
        vector_dict[tuple(truncated_pos)] = obj
    return vector_dict

def store_dict_vector(self, source=True):
    selection = cmds.ls(sl=1,l=1) # make sure you set l flag to 1
    selected_constraint = cmds.ls(selection,l=1,type="constraint")
    valid_selection = [item for item in selection if item not in selected_constraint]
    if valid_selection:
        if source:
            self.source_dict = self.store_vector(valid_selection)
        else:
            self.target_dict = self.store_vector(valid_selection)
    else:
        if source:
            self.source_dict = {}
        else:
            self.target_dict = {}
```

The <CodeText>store_dict_vector</CodeText> helps with getting the object from the current selection. We also want to separate function that stores the vector into a dictionary inside <CodeText>store_vector</CodeText> because we need to convert each translation unit into a tuple (dictionary key only accepts immutable types). 

If you notice, inside the <CodeText>store_vector</CodeText> function, we called the <CodeText>truncate</CodeText> function when storing the translation unit from <CodeText>xform</CodeText>. The reason is that when using <CodeText>xform</CodeText> command, the returned value is a float, and oftentimes it has a struggle with the precision of floating-point numbers. That's why we can mitigate this problem by truncating the floating-point into a smaller amount.

```py 
def truncate(self, value, decimal_amount):
    if value >= 0.0:
        return math.floor(value * 10 ** decimal_amount) / 10 ** decimal_amount
    else:
        return math.ceil(value * 10 ** decimal_amount) / 10 ** decimal_amount
```

> code credit: https://stackoverflow.com/questions/29246455

## Constraint operation
Now we already learned how to store the dictionary value for both parent and child, the next step is to constrain the parent to the corresponding child object. For this process, we will loop through the parent key and handle if there is a matching key in the children dictionary. Let's look at the code!

```py
 def constraint_operation(self, source_vector_dict, target_vector_dict):
    self.unresolved_object = []
    
    cmds.undoInfo(openChunk=True, cn="ConstraintFromPosition")

    for pos in self.target_dict.keys():   
        if pos in self.source_dict.keys():  
            if self.parent_constraint_radiobtn.isChecked():
                cmds.parentConstraint(self.source_dict.get(pos),self.target_dict.get(pos))
            elif self.point_constraint_radiobtn.isChecked():
                cmds.pointConstraint(self.source_dict.get(pos),self.target_dict.get(pos))
            elif self.orient_constraint_radiobtn.isChecked():
                cmds.orientConstraint(self.source_dict.get(pos),self.target_dict.get(pos))
            else: 
                pass
            if self.scale_constraint_checkbox.isChecked():
                cmds.scaleConstraint(self.source_dict.get(pos),self.target_dict.get(pos))
        else:
            self.unresolved_object.append(self.target_dict.get(pos))

    cmds.undoInfo(closeChunk=True)
    
    if self.unresolved_object: 
        cmds.warning("{0} target missing constraint, see constraint window for more action".format(len(self.unresolved_object)))

    cmds.select(cl=1)
```

> **Note**: I already made a set of radio button UI to determine which constraint to use, that's why we're using it as a condition handler for constraint type.

In the code, I added [undoInfo](https://download.autodesk.com/us/maya/2010help/commandspython/undoInfo.html) command to wrap the whole constraint operation. This is important, otherwise when you have a lot of constraints it will take forever just to undo the operation. 

Lastly, it would be nice to let the user know if there is an object that is not constrained when it doesn't have a match. I stored this object inside the <CodeText>unresolved_object</CodeText> variable, and we can query this variable if we want to display the object inside the UI.

## Adding the UI using PySide2

Now as a final touch, I already added the UI into the code with PySide2. You can use PyQt, and it would still work, it's only a matter of preference.

```py
from PySide2 import QtCore,QtWidgets,QtGui
from shiboken2 import wrapInstance

import math

import maya.cmds as cmds
import maya.OpenMayaUI as omui

# Return the maya main window widget as a python object
def maya_main_window():
    main_window_ptr = omui.MQtUtil.mainWindow()
    return wrapInstance(int(main_window_ptr), QtWidgets.QWidget)

class constraintFromPosWindow(QtWidgets.QDialog):
    
    # runtime cache 
    source_dict = {}
    target_dict = {}
    unresolved_object = []
    rebuild_in_progress = False
    warning_output = False

    class_instance = None
    @classmethod
    def show_dialog(cls):
        if not cls.class_instance:
            cls.class_instance = constraintFromPosWindow()
        if cls.class_instance.isHidden():
            cls.class_instance.show()
        else:
            cls.class_instance.raise_()
            cls.class_instance.activateWindow()
    
    def __init__(self, parent=maya_main_window()):
        super(constraintFromPosWindow ,self).__init__(parent)

        self.setWindowTitle("Constraint From Position Options")
        self.setWindowFlags(QtCore.Qt.WindowType.Window)
        self.setStyleSheet("borderstyle:outset")
        self.setMinimumWidth(250)
        self.setMinimumHeight(160)
        self.resize(350,210)

        # Remove window question 
        self.setWindowFlags(self.windowFlags() ^ QtCore.Qt.WindowContextHelpButtonHint)
        
        # init window
        self.create_widgets()
        self.create_layouts()
        self.create_connections()
        
    def create_widgets(self):
        
        # label
        self.warning_label = QtWidgets.QLabel("// Warning: some target missing constraint")
        self.warning_label.setStyleSheet("color:#101010")

        # line edit
        self.source_line_Edit = QtWidgets.QLineEdit()
        self.source_line_Edit.setMinimumHeight(25)
        self.source_line_Edit.setReadOnly(True)
        self.target_line_Edit = QtWidgets.QLineEdit()
        self.target_line_Edit.setMinimumHeight(25)
        self.target_line_Edit.setReadOnly(True)
        
        # checkbox 
        self.maintain_offset_checkbox = QtWidgets.QCheckBox("Maintain offset")
        self.maintain_offset_checkbox.setChecked(True)
        self.scale_constraint_checkbox = QtWidgets.QCheckBox("Scale")
        self.scale_constraint_checkbox.setChecked(True)
        
        # Button
        self.source_btn = QtWidgets.QPushButton("Source")
        self.source_btn.setMinimumHeight(25)
        self.target_btn = QtWidgets.QPushButton("Target")
        self.target_btn.setMinimumHeight(25)
        self.warning_btn = QtWidgets.QPushButton("Select")
        self.warning_btn.setStyleSheet("background-color:#dbca81; color:#101010;")
        self.constraint_btn = QtWidgets.QPushButton("Constraint")
        self.constraint_btn.setMinimumHeight(25)
        
        # Progress bar
        self.progress_bar = QtWidgets.QProgressBar()

        # Radio button
        self.parent_constraint_radiobtn = QtWidgets.QRadioButton("Parent")
        self.parent_constraint_radiobtn.setChecked(True)
        self.point_constraint_radiobtn = QtWidgets.QRadioButton("Point")
        self.orient_constraint_radiobtn = QtWidgets.QRadioButton("Orient")
        self.no_constraint_radiobtn = QtWidgets.QRadioButton("None")
        
        # widget
        self.warning_widget = QtWidgets.QWidget()
        self.warning_widget.setStyleSheet("background-color:#e8e884")
        self.warning_widget.setContentsMargins(0,0,0,0)

        # Set default widgets visibility
        self.update_visibility()
        
    def create_layouts(self):
        self.main_layout = QtWidgets.QVBoxLayout(self)
        
        # Layout
        self.row1_layout = QtWidgets.QHBoxLayout()
        self.row2_layout = QtWidgets.QHBoxLayout()
        self.options1_layout = QtWidgets.QHBoxLayout()
        self.options2_layout = QtWidgets.QHBoxLayout()
        self.progress_layout = QtWidgets.QHBoxLayout()
        self.warning_wrapper_layout = QtWidgets.QVBoxLayout()
        self.warning_layout = QtWidgets.QHBoxLayout(self.warning_widget)
        self.bottom_layout = QtWidgets.QHBoxLayout()
        
        # parent widget to layout
        self.options1_layout.addWidget(self.maintain_offset_checkbox)
        self.options1_layout.addWidget(self.scale_constraint_checkbox)
        self.options1_layout.addItem(self.horizontal_spacer())
        self.options2_layout.addWidget(self.parent_constraint_radiobtn)
        self.options2_layout.addWidget(self.point_constraint_radiobtn)
        self.options2_layout.addWidget(self.orient_constraint_radiobtn)
        self.options2_layout.addWidget(self.no_constraint_radiobtn)
        self.options2_layout.addItem(self.horizontal_spacer())
        self.row1_layout.addWidget(self.source_line_Edit)
        self.row1_layout.addWidget(self.source_btn)
        self.row2_layout.addWidget(self.target_line_Edit)
        self.row2_layout.addWidget(self.target_btn)
        self.progress_layout.addItem(self.horizontal_spacer())
        self.progress_layout.addWidget(self.progress_bar)
        self.warning_wrapper_layout.addWidget(self.warning_widget)
        self.warning_layout.addWidget(self.warning_label)
        self.warning_layout.addItem(self.horizontal_spacer())
        self.warning_layout.addWidget(self.warning_btn)
        self.bottom_layout.addWidget(self.constraint_btn)
        
        # parent layout/widget to main_layout
        self.main_layout.addLayout(self.options1_layout)
        self.main_layout.addLayout(self.options2_layout)
        self.main_layout.addLayout(self.row1_layout)
        self.main_layout.addLayout(self.row2_layout)
        self.main_layout.addItem(self.vertical_spacer())
        self.main_layout.addLayout(self.progress_layout)
        self.main_layout.addLayout(self.warning_wrapper_layout)
        self.main_layout.addLayout(self.bottom_layout)
        
    def create_connections(self):
        self.source_btn.clicked.connect(self.store_source_vector)
        self.target_btn.clicked.connect(self.store_target_vector)
        self.constraint_btn.clicked.connect(self.constraint_operation)
        self.warning_btn.clicked.connect(self.select_unresolved_object)

    def horizontal_spacer(self,width=0,height=0):
        return QtWidgets.QSpacerItem(width, height, QtWidgets.QSizePolicy.Expanding, QtWidgets.QSizePolicy.Fixed)

    def vertical_spacer(self,width=0,height=0):
        return QtWidgets.QSpacerItem(width, height, QtWidgets.QSizePolicy.Fixed, QtWidgets.QSizePolicy.Expanding)

    def update_visibility(self):
        self.progress_bar.setVisible(self.rebuild_in_progress)
        self.warning_label.setVisible(self.warning_output)
        self.warning_btn.setVisible(self.warning_output)
        self.warning_widget.setVisible(self.warning_output)

    # SRC = https://stackoverflow.com/questions/29246455/python-setting-decimal-place-range-without-rounding
    def truncate(self, value, decimal_amount):
        if value >= 0.0:
            return math.floor(value * 10 ** decimal_amount) / 10 ** decimal_amount
        else:
            return math.ceil(value * 10 ** decimal_amount) / 10 ** decimal_amount

    def store_vector(self, obj, decimal_amount=2):
        selection = obj
        vector_dict = {}
        for obj in selection:
            truncated_pos = []
            pos = cmds.xform(obj, q=1, ws=1, t=1)
            for point in pos:
                truncated_pos.append(self.truncate(point, decimal_amount))
            vector_dict[tuple(truncated_pos)] = obj
        return vector_dict
        
    def select_unresolved_object(self):
        cmds.select(self.unresolved_object)
        self.warning_output = False
        self.update_visibility()
    
    def store_source_vector(self):
        selection = cmds.ls(sl=1,l=1)
        selected_constraint = cmds.ls(selection,l=1,type="constraint")
        valid_selection = [item for item in selection if item not in selected_constraint]
        if valid_selection:
            self.source_dict = self.store_vector(valid_selection)
            self.source_line_Edit.setText(', '.join(self.source_dict.values()))
        else:
            self.source_dict = {}
            self.source_line_Edit.setText("Null")

    def store_target_vector(self):
        selection = cmds.ls(sl=1,l=1)
        selected_constraint = cmds.ls(selection,l=1,type="constraint")
        valid_selection = [item for item in selection if item not in selected_constraint]
        if valid_selection:
            self.target_dict = self.store_vector(valid_selection)
            self.target_line_Edit.setText(', '.join(self.target_dict.values()))
        else:
            self.target_dict = {}
            self.target_line_Edit.setText("Null")

    def constraint_operation(self):
        try:
            self.constraint_from_pos_progress(self.source_dict, self.target_dict)
        except Exception as error:
            cmds.warning(str(error))
            self.rebuild_in_progress = False
            self.update_visibility()
            cmds.undoInfo(closeChunk=True)

    def constraint_from_pos_progress(self, source_vector_dict, target_vector_dict):        
            if self.rebuild_in_progress:
                return
            
            # constraint configuration
            self.unresolved_object = []
            offset = self.maintain_offset_checkbox.isChecked()
            number_of_progress = len(self.target_dict.keys()) # how many step (say 30 iteration = 30 step)
                
            self.progress_bar.setRange(0,number_of_progress)
            self.progress_bar.setValue(0)
            self.rebuild_in_progress = True
            self.update_visibility()
            
            count = 1
            cmds.undoInfo(openChunk=True, cn="ConstraintFromPosition")
            for pos in self.target_dict.keys():   
                if not self.rebuild_in_progress: break
                if pos in self.source_dict.keys():  
                    if self.parent_constraint_radiobtn.isChecked():
                        cmds.parentConstraint(self.source_dict.get(pos),self.target_dict.get(pos),mo=offset)
                    elif self.point_constraint_radiobtn.isChecked():
                        cmds.pointConstraint(self.source_dict.get(pos),self.target_dict.get(pos),mo=offset)
                    elif self.orient_constraint_radiobtn.isChecked():
                        cmds.orientConstraint(self.source_dict.get(pos),self.target_dict.get(pos),mo=offset)
                    else: 
                        pass
                    if self.scale_constraint_checkbox.isChecked():
                        cmds.scaleConstraint(self.source_dict.get(pos),self.target_dict.get(pos),mo=offset)
                else:
                    self.unresolved_object.append(self.target_dict.get(pos))
                self.progress_bar.setValue(count)
                count += 1
                QtCore.QCoreApplication.processEvents() # let other event (update percentage) work in background
                
            cmds.undoInfo(closeChunk=True)
            if self.unresolved_object: 
                self.warning_output = True
                cmds.warning("{0} target missing constraint, see constraint window for more action".format(len(self.unresolved_object)))
            self.rebuild_in_progress = False
            self.update_visibility()
            cmds.select(cl=1)

# development phase code
if __name__ == "__main__":
    
    try:
        window.close()
        window.deleteLater()
    except:
        pass
    
    window = constraintFromPosWindow()
    window.show()
```

There are some stuffs that I changed including:
- Adding a progress bar to the constraint operation, so the user can see how long the process approximately will take
- Separating <CodeText>store_dict_vector</CodeText> into source and target to make it clearer
- Unresolved object warning and other minor UI features for user interactivity

![position constraint](/images/portofolio/position_constraint.gif "Position Constraint Tool")

Final word, I hope you will find this article useful and get some benefit from this tool. Even if you don't, I thank you for reading through the end of this article. Cheers! 🥂