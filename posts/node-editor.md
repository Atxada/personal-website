--- 
title: 'Node Editor Custom GUI'
date: "June 15, 2024"
category: "projects"
tags: ["Python", "PyQt", "Application"]
thumbnail: /images/portofolio/node_editor_thumbnail.PNG
alt: 'Node Editor Custom GUI'
excerpt: "This is the excerpt"
---

<iframe src="https://www.linkedin.com/embed/feed/update/urn:li:ugcPost:7206729033827495936?compact=1" height="399" width="700" frameborder="0" allowfullscreen="" title="Embedded post"></iframe>

![Node Editor UI](https://github.com/Atxada/Node_Editor/blob/main/docs/Node%20Editor%20UI.PNG?raw=true "Node Editor UI")

## Description

The initial goal of this project is to create an auto-rig for Maya and get a better understanding of the Qt Framework to create a more complex GUI.

I plan to continue developing this project's architecture by adding more functions and features as I develop my knowledge. 
The main reason to create a custom node editor is to visualize the rigging structure and promote reusability. 
Each node contains its own data structure that can be deserialized or serialized whenever needed.
This project has been fun and stressful for me, but through it all, I learned so many things.
thanks to all the resources and people online who have helped me when I'm stuck. As a gratitude, I want to share this project with anyone interested.

Also, **big thanks to Pavel Křupala** for the node editor GUI tutorial he provided. It helps me a lot to start building my basic knowledge of the Qt framework and many important topics (event/callback, debugging process, sphinx documentation, etc.). After the course, I also continued to develop a few more helpful features and remake the node editor's graphic visual.

The resource link:
https://www.blenderfreak.com/tutorials/node-editor-tutorial-series/

> For more information about how to use and source code, please check my [github](https://github.com/Atxada/Node_Editor).

## Features
- full framework for creating customizable graphs, nodes, sockets, and edges
![customizable node editor](https://github.com/Atxada/Node_Editor/blob/main/docs/Example%20Node%20Editor.gif?raw=true)
- support for undo/redo and serialization into files
- support for implementing evaluation logic
- scene mode to edit nodes (dragging edge, rerouting edge, cutting edge, etc.)
![edit nodes mode](https://github.com/Atxada/Node_Editor/blob/main/docs/Mode%20Node%20Editor.gif?raw=true)
- simple set of math nodes to use as a demo
- support for saving custom executable scripts
- simple maya context (zSpline) 
- command line interpreters consisting of some handy scripts (? for help)
![command line intertpreters](https://github.com/Atxada/Node_Editor/blob/main/docs/Command%20line%20Node%20Editor.gif?raw=true)
- tested in Maya 2020.4 (python 2.7) and 2022 (python 3.7).

## Links
- [Documentation](https://zeno-node-editor.readthedocs.io/en/latest/)
- [Linkedin](https://www.linkedin.com/in/aldo-aldrich-962975220/)