--- 
title: 'Create Simple Node GUI'
date: "July 1, 2024"
category: "articles"
tags: ["Python", "PyQt"]
thumbnail: /images/portofolio/node_editor_thumbnail2.PNG
alt: "Position Constraint Tool"
excerpt: "This is the excerpt"
---

![Node Editor Demo](/images/portofolio/node_editor_demo1.gif "Node Editor Demo")

Recently, I just finished developing [Node Editor GUI](/projects/node-editor) which meant to be the main UI for my auto-rig. It turns out that this GUI was a much bigger project than I had expected it to be. So, in this article, I want to give the reader some insights into how I create the node editor GUI, but of course, we won't break down every single element from this application. I'm only going to share the script for creating the node graphics, but you can find the full node editor source code [here](https://github.com/Atxada/Node_Editor). Thank you!

> Make sure you installed Python 3+ and PySide6 on your computer to run this application

```py  

from PySide6 import QtCore, QtWidgets, QtGui
import sys, math

# sockets constant
LEFT = 1
RIGHT = 2

class NodeGraphics(QtWidgets.QGraphicsItem):
    def __init__(self, graphics_scene, inputs=[1], outputs=[1], title="Math", icon=QtGui.QImage("math_icon.png"), parent=None):
        super().__init__(parent)
        self.graphics_scene = graphics_scene
        self.inputs = inputs
        self.outputs = outputs
        self.title = title
        self.icon = icon

        self.setFlag(NodeGraphics.ItemIsMovable)
        
        # initialize node
        self.initSizes()
        self.initAsset()
        self.initTitle()
        self.initContent()
        self.initSockets()

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

    def initContent(self):
        test_lbl = NodeContentWidget(self)
        test_lbl.setGeometry(0, self.title_height,self.width,self.height-self.title_height-self.edge_roundness)
        self.content_graphic = self.graphics_scene.addWidget(test_lbl)  # get the QGraphicsProxyWidget when inserted into the scene_graphic
        self.content_graphic.setParentItem(self)    # parent content to node

    def initSockets(self):
        # create new sockets
        for count in range(len(self.inputs)):
            SocketGraphics(node=self, index=count, position=LEFT, socket_amount=len(self.inputs))
        for count in range(len(self.outputs)):
            SocketGraphics(node=self, index=count, position=RIGHT, socket_amount=len(self.inputs))

    def boundingRect(self):
        return QtCore.QRectF(0, 0, self.width, self.height).normalized() # Defining Qt' bounding rectangle

    def getSocketPosition(self, index, position):
        x = -1 if position is LEFT else self.width + 1
        y = (self.title_height + self.socket_spacing/2) + (index*self.socket_spacing)
        return [x, y]

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

            # draw node icon
            painter.drawImage(QtCore.QRectF(self.width-self.title_padding-20, 2.5, 15, 15),self.icon,QtCore.QRectF(0, 0, 32, 32))

            # paint outline element
            path_outline = QtGui.QPainterPath()
            path_outline.addRoundedRect(-1, -1, self.width+2, self.height+2, self.edge_roundness, self.edge_roundness)
            painter.setBrush(QtCore.Qt.NoBrush)

            painter.setPen(self.outline_pen) 
            painter.drawPath(path_outline.simplified())

class addNode(NodeGraphics):
    def __init__(self, graphics_scene, inputs=[1,1], outputs=[1], title="Add", icon=QtGui.QImage("add.png"), parent=None):
        super().__init__(graphics_scene, inputs, outputs, title, icon, parent)

class subNode(NodeGraphics):
    def __init__(self, graphics_scene, inputs=[1,1], outputs=[1], title="Subtract", icon=QtGui.QImage("sub.png"), parent=None):
        super().__init__(graphics_scene, inputs, outputs, title, icon, parent)

class multiNode(NodeGraphics):
    def __init__(self, graphics_scene, inputs=[1,1], outputs=[1], title="Multiply", icon=QtGui.QImage("mul.png"), parent=None):
        super().__init__(graphics_scene, inputs, outputs, title, icon, parent)

class divNode(NodeGraphics):
    def __init__(self, graphics_scene, inputs=[1,1], outputs=[1], title="Divide", icon=QtGui.QImage("divide.png"), parent=None):
        super().__init__(graphics_scene, inputs, outputs, title, icon, parent)

class NodeContentWidget(QtWidgets.QWidget):
    def __init__(self, node, parent=None):
        super(NodeContentWidget,self).__init__(parent)
        self.node = node
        self.nodeLayout = QtWidgets.QVBoxLayout(self)
        self.nodeLayout.setContentsMargins(8,2,0,0)

        self.setStyleSheet("background: transparent; color:rgb(212, 212, 212); font-size:10px;")  # override maya default background color for QWidget
        self.initUI()

    def initUI(self):
        label_amount = max(len(self.node.inputs),len(self.node.outputs)) 

        for edit in range(label_amount):
            lbl = QtWidgets.QLabel("input %s"%(edit+1))
            lbl.setAlignment(QtCore.Qt.AlignLeft)
            lbl.setFixedHeight(14)
            self.nodeLayout.addWidget(lbl)

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
        self.setPos(*self.node.getSocketPosition(self.index, self.position))    # immediately set socket position

    def initAssets(self):
        self._color_background = QtGui.QColor("#609f62")
        self._color_outline = QtGui.QColor("#1b1818")

        self._pen = QtGui.QPen(self._color_outline)
        self._pen.setWidthF(self.outline_width)
        self._brush = QtGui.QBrush(self._color_background)

    def paint(self, painter, option, widget):
        painter.setBrush(self._brush)
        painter.setPen(self._pen)
        painter.drawEllipse(-self.radius,
                            -self.radius,
                            2*self.radius,
                            2*self.radius)
        
    def boundingRect(self):
        return QtCore.QRectF(-self.radius - self.outline_width,
                             -self.radius - self.outline_width,
                             2*(self.radius+self.outline_width),
                             2*(self.radius+self.outline_width)).normalized()

class NodeGraphicsScene(QtWidgets.QGraphicsScene):
    def __init__(self, parent=None):
        super().__init__(parent)    

        self.width = 800
        self.height = 600

        # grid settings
        self.grid_size = 30
        self.grid_squares = 4
        
        self.color_background = QtGui.QColor("#303030") # blue color > QtGui.QColor("#222933")
        self.color_light = QtGui.QColor("#606060") # old > QtGui.QColor("#2f2f2f")
        self.color_dark = QtGui.QColor("#151515") # old > QtGui.QColor("#303030")
        
        self.pen_light = QtGui.QPen(self.color_light)
        self.pen_light.setWidthF(0.2)
        self.pen_dark = QtGui.QPen(self.color_dark)
        self.pen_dark.setWidthF(0.75)
        
        self.setBackgroundBrush(self.color_background)
        self.setSceneRect(-self.width/2, -self.height/2, self.width, self.height)

    def addItemToScene(self, node_class, position=QtCore.QPoint(0,0)):
        node = node_class(self, [1,1], [1])
        self.addItem(node)
        node.setPos(position)

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

class MainWindow(QtWidgets.QWidget):
    def __init__(self):
       super().__init__()
       self.initUI()

    def initUI(self):
        self.setWindowTitle("Node Editor")
        self.setGeometry(200, 200, 800, 600)
        self.main_layout = QtWidgets.QVBoxLayout()
        self.setLayout(self.main_layout)

        self.scene = NodeGraphicsScene()
        self.view = QtWidgets.QGraphicsView(self.scene)
        self.view.contextMenuEvent = self.contextMenuHandler
        self.view.setViewportUpdateMode(QtWidgets.QGraphicsView.FullViewportUpdate) # keep update the background scene when item move
        self.main_layout.addWidget(self.view)

    def contextMenuHandler(self, event):
        menu = QtWidgets.QMenu()

        addStruct = menu.addAction(QtGui.QIcon("add.png"),'add node')
        subStruct = menu.addAction(QtGui.QIcon("sub.png"),'subtract node')
        mulStruct = menu.addAction(QtGui.QIcon("mul.png"),'multiply node')
        divStruct = menu.addAction(QtGui.QIcon("divide.png"),'divide node')

        position = self.view.mapToScene(event.pos())
        res = menu.exec(event.globalPos())

        if res == addStruct:
            self.scene.addItemToScene(addNode, position)
        if res == subStruct:
            self.scene.addItemToScene(subNode, position)
        if res == mulStruct:
            self.scene.addItemToScene(multiNode, position)
        if res == divStruct:
            self.scene.addItemToScene(divNode, position)
        

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)


    window = MainWindow()
    window.show()

    sys.exit(app.exec())

```