--- 
title: 'Create a Simple Node GUI'
date: "July 1, 2024"
category: "articles"
tags: ["Python", "PyQt", "Application"]
thumbnail: /images/portofolio/node_editor_thumbnail2.PNG
alt: "Node GUI"
excerpt: "This is the excerpt"
---

![Node Editor Demo](/images/portofolio/node_editor_demo1.gif "Node Editor Demo")

Recently, I just finished developing [Node Editor GUI](/projects/node-editor) which is meant to be the main UI for my auto-rig. It turns out this GUI was a much bigger project than I had expected it to be. So, in this article, I want to give the reader some insights into how I create the node editor GUI. We won't break down every single element from this application, instead I'm only going to break down the method for creating the node graphics. Let's just jump right into it!

> Make sure you installed Python 3+ and PySide6 on your computer to run the application, you can find the full node editor source code [here](https://github.com/Atxada/Node_Editor)

## Setting up the QGraphicsScene
To create a viewport inside Qt we will using 2 main class, the [QGraphicsScene](https://doc.qt.io/qtforpython-5/PySide2/QtWidgets/QGraphicsScene.html) and [QGraphicsView](https://doc.qt.io/qtforpython-5/PySide2/QtWidgets/QGraphicsView.html). The QGraphicsScene will serve as a container for all the nodes or other necessary graphics items. On the other hand, QGraphicsView is used for visualizing the contents of a QGraphicsScene in a scrollable viewport.

We will start by creating the QGraphicsScene. By inheriting  the QGraphicsScene class, I will create a viewport with a width of 800px and height of 600px. We need to pass the width and height to the <CodeText>setSceneRect</CodeText> function, so it will tell the QGraphicsView how big is our scene.

```py
class NodeGraphicsScene(QtWidgets.QGraphicsScene):
    def __init__(self, parent=None):
        super().__init__(parent)    

        self.width = 800
        self.height = 600

        # setSceneRect(x, y, w, h)
        self.setSceneRect(-self.width/2, -self.height/2, self.width, self.height)   
```

> Notice that inside <CodeText>setSceneRect</CodeText> function, I negate and divide width and height by 2. This is because I want to center the scene rectangle to our viewport.

Now let's take a look at our QGraphicsScene! 

![QGraphicsScene preview](/images/portofolio/QGraphicsScene1.PNG "QGraphicsScene Preview ")

You can scroll around the viewport, but that's pretty much it. Looks boring right? That's why we need to draw some background to make it more appealing. We will draw a grid background with the help of <CodeText>QPen</CodeText> inside, of our <CodeText>drawBackground</CodeText> function, but first we need to determine the color for the grid and set up the QPen.

```py
class NodeGraphicsScene(QtWidgets.QGraphicsScene):
    def __init__(self, parent=None):
        super().__init__(parent)    

        self.width = 800
        self.height = 600

        # grid settings
        self.grid_size = 30
        self.grid_squares = 4
        
        self.color_background = QtGui.QColor("#303030")
        self.color_light = QtGui.QColor("#606060") 
        self.color_dark = QtGui.QColor("#151515")
        
        self.pen_light = QtGui.QPen(self.color_light)
        self.pen_light.setWidthF(0.2)
        self.pen_dark = QtGui.QPen(self.color_dark)
        self.pen_dark.setWidthF(0.75)
        
        self.setBackgroundBrush(self.color_background)

        # setSceneRect(x, y, w, h)
        self.setSceneRect(-self.width/2, -self.height/2, self.width, self.height)
```

I created 2 types of QPen, one for the dark grid and the other for the light grid to make more variation. For the background color, you can just set it using <CodeText>setSceneRect</CodeText> function by passing the color. Inside the <CodeText>drawBackground</CodeText> function, we will specify how we would like to draw our background. First, let's look at the code snippet below!

```py
    def drawBackground(self, painter, rect):
        super().drawBackground(painter, rect)
        
        # calculate line and draw line
        left = int(math.floor(rect.left()))
        right = int(math.ceil(rect.right()))
        top = int(math.floor(rect.top()))
        bottom = int(math.ceil(rect.bottom()))
        
        first_left = left - (left % self.grid_size)
        first_top = top - (top % self.grid_size)
        lines_light, lines_dark = [], []

        for x in range(first_left, right, self.grid_size):
            if (x % (self.grid_size*self.grid_squares) != 0): lines_light.append(QtCore.QLine(x, top, x, bottom))
            else: lines_dark.append(QtCore.QLine(x, top, x, bottom))
        
        for y in range(first_top, bottom, self.grid_size):
            if (y % (self.grid_size*self.grid_squares) != 0): lines_light.append(QtCore.QLine(left, y, right, y))
            else: lines_dark.append(QtCore.QLine(left, y, right, y))
            
        painter.setPen(self.pen_light)
        painter.drawLines(lines_light)
        
        painter.setPen(self.pen_dark)
        painter.drawLines(lines_dark)
```

Since we will draw the grid line vertically and horizontally, we need to know the coordinates for each side of the viewport. We are doing this by querying the bounding rectangle (left, right, top, bottom). Then inside the for loop, we are using a condition to check if the current coordinate has a remainder. I multiply the <CodeText>grid_size</CodeText> with <CodeText>grid_squares</CodeText> to make sure the darker lines are drawn every 4 grid tiles (we specified the <CodeText>grid_size</CodeText> inside <CodeText>\_\_init\_\_</CodeText> function). Finally, after appending all the valid line coordinates, we used the painter function called <CodeText>drawLines</CodeText> to draw it inside our scene.

![QGraphicsScene grids](/images/portofolio/QGraphicsScene2.PNG "QGraphicsScene with grids")

## Creating the QGraphicsItem
We just finished learning about how we can create a simple graphics scene, now we can place some nodes here. For the node we will use [QGraphicsItem](https://doc.qt.io/qtforpython-5/PySide2/QtWidgets/QGraphicsItem.html) class and inside there we will set all the necessary configurations to draw our node. Let's look at the code snippet below!

### Drawing the node
```py
class NodeGraphics(QtWidgets.QGraphicsItem):
    def __init__(self, graphics_scene, title="Math", parent=None):
        super().__init__(parent)
        self.graphics_scene = graphics_scene
        self.title = title

        self.setFlag(NodeGraphics.ItemIsMovable)
        
        self.initSizes()
        self.initAsset()
        self.initTitle()

    def initSizes(self):
        self.socket_spacing = 20
        self.width = 160
        self.edge_roundness = 5
        self.title_height = 25
        self.title_padding = 5  

        self.segment_amount = max(len(self.inputs),len(self.outputs)) 
        self.height = self.title_height + (self.segment_amount*self.socket_spacing) + (self.socket_spacing/4)

    def initAsset(self):
        self.title_color = QtCore.Qt.white
        self.title_font = QtGui.QFont("Ubuntu", 10)

        self.outline_color = QtGui.QColor("#1b1818")
        self.outline_pen = QtGui.QPen(self.outline_color)
        self.outline_pen.setWidthF(2.0)

        self.brush_title = QtGui.QBrush(QtGui.QColor("#912130"))
        self.brush_background = QtGui.QBrush(QtGui.QColor("#4b4c51"))
        self.brush_segment = QtGui.QBrush(QtGui.QColor("#595b61")) 

    def initTitle(self):
        self.title_item = QtWidgets.QGraphicsTextItem(self)
        self.title_item.setPlainText(self.title)
        self.title_item.setDefaultTextColor(self.title_color)
        self.title_item.setFont(self.title_font)
        self.title_item.setPos(self.title_padding, 0)

    def boundingRect(self):
        return QtCore.QRectF(0, 0, self.width, self.height).normalized() # Defining Qt' bounding rectangle
```

As you can see, I already defined all the size, text, and color configurations inside each corresponding init function, I seperated it to make it more readable. Notice that there is a <CodeText>boundingRect</CodeText> function. This is a virtual function that we need to specify when we inherit QGraphicsItem. This function will tell the QGraphicsScene about how big our item is for back-end stuff.

Now we need to draw our node, and that is by overriding the <CodeText>paint</CodeText> function. We start by drawing the title segment for our node.

```py
    def paint(self, painter, option, widget):
        # paint title segment
        path_title = QtGui.QPainterPath()
        path_title.setFillRule(QtCore.Qt.WindingFill)
        path_title.addRoundedRect(0, 
                                0, 
                                self.width, 
                                self.title_height, 
                                self.edge_roundness, 
                                self.edge_roundness)
        path_title.addRect(0,
                        (self.title_height-self.edge_roundness),
                        self.edge_roundness,
                        self.edge_roundness)
        
        path_title.addRect((self.width-self.edge_roundness),
                        (self.title_height-self.edge_roundness),
                        self.edge_roundness,
                        self.edge_roundness)
        
        painter.setPen(QtCore.Qt.NoPen)
        painter.setBrush(self.brush_title)
        painter.drawPath(path_title.simplified())
```

By using [QPainterPath](https://doc.qt.io/qtforpython-5/PySide2/QtGui/QPainterPath.html) we can draw and combine different shapes. From the code snippet above, I started by adding a rounded rectangle using the <CodeText>addRoundedRect</CodeText> function. This function takes 6 parameters: x, y, width, height, x roundness, and y roundness. This rounded rect is for the header of our node. The other 2 rectangles I draw are used to close the border radius for the bottom side.

Next, we need to draw the body for our node. 

```py
        # paint content segment
        path_content = QtGui.QPainterPath()
        path_content.setFillRule(QtCore.Qt.WindingFill)
        path_content.addRoundedRect(0,
                                    self.title_height,
                                    self.width,
                                    self.height-self.title_height,
                                    self.edge_roundness,
                                    self.edge_roundness)
        path_content.addRect(0,
                            self.title_height,
                            self.edge_roundness,
                            self.edge_roundness)
        
        path_content.addRect(self.width-self.edge_roundness,
                            self.title_height,
                            self.edge_roundness,
                            self.edge_roundness)
        
        painter.setPen(QtCore.Qt.NoPen)
        painter.setBrush(self.brush_background)   
        painter.drawPath(path_content.simplified())    
```

> We already learned about how the code above works, so we might skip to the next part since it might be redundant to explain it again.

```py
        # draw segmented row
        path_segment = QtGui.QPainterPath()
        path_segment.setFillRule(QtCore.Qt.WindingFill)
        segment_offset = (self.height-self.title_height) % self.socket_spacing # find any empty space after last segment 

        for index in range(0,int((self.height-self.title_height)/self.socket_spacing),2):
            y_segment = self.title_height+(self.socket_spacing*index)
            path_segment.addRect(0,y_segment,self.width,self.socket_spacing)
        
        if segment_offset: 
            if self.height - self.title_height > y_segment + self.socket_spacing + self.edge_roundness:
                path_segment.addRoundedRect(0, 
                                            y_segment + self.socket_spacing*2, 
                                            self.width,
                                            segment_offset,
                                            self.edge_roundness,
                                            self.edge_roundness)
                path_segment.addRect(0,
                                    y_segment + self.socket_spacing*2,
                                    self.edge_roundness,
                                    self.edge_roundness)
                
                path_segment.addRect(self.width-self.edge_roundness,
                                    y_segment + self.socket_spacing*2,
                                    self.edge_roundness,
                                    self.edge_roundness)
        
        painter.setPen(QtCore.Qt.NoPen)
        painter.setBrush(self.brush_segment)
        painter.drawPath(path_segment) 
```

From the code above, I colored the row inside the node body to make the input/output list more distinguishable (this is inspired by Maya node model). We calculate the row by using a for loop range to determine how many row we have in the node body, also notice inside the range I'm using 2 steps so we will draw it for every other row. 

```py
        # paint outline element
        path_outline = QtGui.QPainterPath()
        path_outline.addRoundedRect(-1, -1, self.width+2, self.height+2, self.edge_roundness, self.edge_roundness)
        painter.setBrush(QtCore.Qt.NoBrush)

        painter.setPen(self.outline_pen) 
        painter.drawPath(path_outline.simplified())
```

Finally, we draw the node border using a rounded rectangle to include the border radius.

### Placing the node to the scene
After drawing the node, we can add it to the scene. For now, we will treat it as a debug for preview purposes. Inside the <CodeText>NodeGraphicsScene</CodeText> I added a new function called <CodeText>addItemDebug</CodeText> where I created the node and added it to the scene. For more details let's look at the code snippet below.

```py
    def addItemDebug(self, position=QtCore.QPoint(0,0)):
        node = NodeGraphics(self)
        self.addItem(node)
        node.setPos(position)
```

Now when you run the program it should show something like this.

![Node Editor Demo](/images/portofolio/node_editor_demo2.gif "Node Editor Demo")

Looks neat right? I think now we can add the node content to display the name for the input/output. We will be creating a new widget class for this and then parent it inside our node body.

```py
class NodeContentWidget(QtWidgets.QWidget):
    def __init__(self, node, parent=None):
        super().__init__(parent)
        self.node = node
        self.nodeLayout = QtWidgets.QVBoxLayout(self)
        self.nodeLayout.setContentsMargins(8,2,0,0)

        self.setStyleSheet("background: transparent; color:rgb(212, 212, 212); font-size:10px;")  # override default background color for QWidget
        self.initUI()

    def initUI(self):
        label_amount = max(len(self.node.inputs),len(self.node.outputs)) 

        for edit in range(label_amount):
            lbl = QtWidgets.QLabel("input %s"%(edit+1))
            lbl.setAlignment(QtCore.Qt.AlignLeft)
            lbl.setFixedHeight(14)
            self.nodeLayout.addWidget(lbl)
```

By inheriting the <CodeText>QWidget</CodeText> class, I created a relatively simple content layout. You might need to fiddle with the size or content margins to get the desired result.

Now we can attach the node content to our node body. Inside the <CodeText>NodeGraphics</CodeText> class, simply create the node content and add it to the scene. Let's look at the code below!

```py
    def initContent(self):
        test_lbl = NodeContentWidget(self)
        test_lbl.setGeometry(0, self.title_height,self.width,self.height-self.title_height-self.edge_roundness)
        self.content_graphic = self.graphics_scene.addWidget(test_lbl)  # get the QGraphicsProxyWidget when inserted into the scene_graphic
        self.content_graphic.setParentItem(self)    # parent content to node
```

> Don't forget to call <CodeText>initContent</CodeText> inside the <CodeText>\_\_init\_\_</CodeText> function

Inside the <CodeText>initContent</CodeText> after we create the node content object, we need to specify the geometry for this widget. After that, we add the widget to the scene using <CodeText>addWidget</CodeText> function, this will return the <CodeText>QGraphicsProxyWidget</CodeText> that later we parent it to our node's body.

Now run the program again and this is what it should look like

![Node inside the viewport](/images/portofolio/QGraphicsScene3.PNG "Node inside the viewport")

## Adding the socket
Let's continue finishing our node by adding some sockets. This is relatively a simple process since we already learned how to draw a graphics item inside a Qt application. For sockets, we will continue inheriting <CodeText>QGraphicsItem</CodeText>. You can look at the details in the code snippet below.

```py
class SocketGraphics(QtWidgets.QGraphicsItem):
    def __init__(self, node, index, position, socket_amount):
        super().__init__(node)

        # settings for socket position
        self.node = node 
        self.index = index
        self.position = position
        self.socket_amount = socket_amount

        self.radius = 5.0   # default 6.0
        self.outline_width = 1.0
        self.initAssets()
        try:
            self.setPos(*self.node.getSocketPosition(self.index, self.position))    # immediately set socket position
        except exception as e:
            print(e)

    def initAssets(self):
        self._color_background = QtGui.QColor("#609f62")
        self._color_outline = QtGui.QColor("#1b1818")

        self._pen = QtGui.QPen(self._color_outline)
        self._pen.setWidthF(self.outline_width)
        self._brush = QtGui.QBrush(self._color_background)
```

Again, same process. We begin by defining the size and color for visual representation. The only thing that is different here is, that we immediately set the graphics item position once it is initialized. We do this by getting all the information from the node (in this case, the node acts as a parent). 

We want to arrange our socket in an ordered manner, that's why we are getting the index, position, and amount value from the node. Now before we set the sockets's position, let's draw our socket!

```py
    def paint(self, painter, option, widget):
        painter.setBrush(self._brush)
        painter.setPen(self._pen)
        painter.drawEllipse(-self.radius,
                            -self.radius,
                            2*self.radius,
                            2*self.radius)
```

It is a more straightforward process since all we need to do is draw a circle. We don't need to set the socket position, because the node class will take care of that. Also, for every <CodeText>QGraphicsItem</CodeText> we need to set the bounding rect. So let's override the <CodeText>boundingRect</CodeText> virtual function.

```py
    def boundingRect(self):
        return QtCore.QRectF(-self.radius - self.outline_width,
                             -self.radius - self.outline_width,
                             2*(self.radius+self.outline_width),
                             2*(self.radius+self.outline_width)).normalized()
```

After all of that work, let's finish the socket part by determining the socket position. Inside the <CodeText>NodeGraphics</CodeText> class, add a new function called <CodeText>initSockets</CodeText> and inside <CodeText>\_\_init\_\_</Codetext> function add two new attributes as follows

```py
    def __init__(self, graphics_scene, inputs=[1], outputs=[1], title="Math", parent=None):
        self.inputs = inputs
        self.outputs = outputs

        self.initSockets()

    def initSockets(self):
        for count in range(len(self.inputs)):
            SocketGraphics(node=self, index=count, position=LEFT, socket_amount=len(self.inputs))
        for count in range(len(self.outputs)):
            SocketGraphics(node=self, index=count, position=RIGHT, socket_amount=len(self.inputs))
```
> Remember we don't override the <CodeText>\_\_init\_\_</Codetext> function, all the previous content is hidden to simplify the code

We are using the inputs and outputs attribute to determine how many sockets we are adding. Inside <CodeText>initSockets</CodeText> function, we are passing the count value to the index parameter and inputs/outputs length to the socket amount parameter.

![Socket preview](/images/portofolio/QGraphicsScene4.PNG "Socket preview")

Up until now, our node editor should look like the image above. To move and order the sockets we will add a new function called <CodeText>getSocketPosition</CodeText> inside of our <CodeText>NodeGraphics</CodeText> class. This function will return the (x, y) coordinate for the corresponding socket

```py
    def getSocketPosition(self, index, position):
        x = -1 if position is LEFT else self.width + 1      # add this constant inside your file LEFT = 1 and RIGHT = 2 
        y = (self.title_height + self.socket_spacing/2) + (index*self.socket_spacing)
        return [x, y]

```

We calculate the Y coordinate by taking into account the <CodeText>socket_spacing</CodeText> attribute. For X coordinate it's very simple just attach it at the left side of the node if the sockets are input and vice versa for output. Please don't forget to add two new constants for this function called LEFT (value of 1) and RIGHT (value of 2).

![Ordered socket preview](/images/portofolio/QGraphicsScene5.PNG "Ordered socket preview")

Run the program once more and the result should be similar to the image above.

## Customize the node class

To close this article, we will create several custom node classes derived from <CodeText>NodeGraphics</CodeText> class and create a simple context menu to instantly add the node to the scene. Let's start with defining some custom node classes.

```py
class addNode(NodeGraphics):
    def __init__(self, graphics_scene, inputs=[1,1], outputs=[1], title="Add", parent=None):
        super().__init__(graphics_scene, inputs, outputs, title, parent)

class subNode(NodeGraphics):
    def __init__(self, graphics_scene, inputs=[1,1], outputs=[1], title="Subtract", parent=None):
        super().__init__(graphics_scene, inputs, outputs, title, parent)

class multiNode(NodeGraphics):
    def __init__(self, graphics_scene, inputs=[1,1], outputs=[1], title="Multiply", parent=None):
        super().__init__(graphics_scene, inputs, outputs, title, parent)

class divNode(NodeGraphics):
    def __init__(self, graphics_scene, inputs=[1,1], outputs=[1], title="Divide", parent=None):
        super().__init__(graphics_scene, inputs, outputs, title, parent)
```

> We will pretend that we are developing a calculator application, so we will add the 4 main operators: add, subtract, multiply, and divide.

We can play around with the input and output parameters to define the socket structure, but I will leave it up to you. Now that we already have all the custom nodes, we can add them to our menu. Inside the main window class, define the view's <CodeText>contextMenuEvent</CodeText> with a new function called <CodeText>contextMenuHandler</CodeText>

```py
class MainWindow(QtWidgets.QWidget):
    def initUI(self):
        self.view.contextMenuEvent = self.contextMenuHandler

    def contextMenuHandler(self, event):
        menu = QtWidgets.QMenu()

        addStruct = menu.addAction(QtGui.QIcon("add.png"),'add node')
        subStruct = menu.addAction(QtGui.QIcon("sub.png"),'subtract node')
        mulStruct = menu.addAction(QtGui.QIcon("mul.png"),'multiply node')
        divStruct = menu.addAction(QtGui.QIcon("divide.png"),'divide node')

        position = self.view.mapToScene(event.pos())
        res = menu.exec(event.globalPos())

        # make sure the custom node class is imported or inside the same file
        if res == addStruct:
            self.scene.addItemToScene(addNode, position)
        if res == subStruct:
            self.scene.addItemToScene(subNode, position)
        if res == mulStruct:
            self.scene.addItemToScene(multiNode, position)
        if res == divStruct:
            self.scene.addItemToScene(divNode, position)
```

To add the menu options, we simply use <CodeText>addAction</CodeText> function and pass the icon (you can pass nothing and it still works). Next, we want our node to be positioned according to the mouse position. To do this, I query the <CodeText>event.pos</CodeText> and map it to the scene. 

We already have the mouse position value, now we need to pass it to the scene. Inside the <CodeText>NodeGraphicsScene</CodeText> class let's add a function called <CodeText>addItemToScene</CodeText> that will handle both node creation and positioning. 

```py
    def addItemToScene(self, node_class, position=QtCore.QPoint(0,0)):
        node = node_class(self, [1,1], [1])
        self.addItem(node)
        node.setPos(position)
```

> Because right now we have a much better way to add a node into the scene, we can get rid of the <CodeText>addItemDebug</CodeText> function we created for debugging. 

Finally, Let's run our program for the last time!

![Final preview node editor](/images/portofolio/node_editor_demo3.gif "Final preview node editor")

And it's done 🎉🎉🎉. The context menu contains all of our custom nodes, and when we click on it the corresponding node will be placed right on our mouse position. I also added a small icon at the left of the node's header, but it's purely cosmetic.

That is all for this article, thank you so much for making it to the end of this article. We just learned to create a simple node editor GUI without any back-end attached to it. If you want to see my complete node editor application please visit my Github Repository [here](https://github.com/Atxada/Node_Editor). I hope you find this article helpful and have a good day!