"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from "@/components/ui/sidebar"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Microchip, 
  Zap, 
  Radio, 
  Cpu, 
  Battery, 
  Wifi, 
  Bluetooth, 
  Usb,
  Plus,
  Save,
  FolderOpen,
  Trash2,
  Edit3,
  Link2,
  MousePointer,
  X,
  LayoutTemplate
} from "lucide-react"

interface ElectronicComponent {
  id: string
  type: string
  name: string
  description: string
  x: number
  y: number
  icon: React.ReactNode
}

interface Connection {
  id: string
  fromComponentId: string
  toComponentId: string
  type: 'power' | 'data' | 'signal' | 'ground'
  label?: string
}

interface Project {
  id: string
  name: string
  description: string
  components: ElectronicComponent[]
  connections: Connection[]
  createdAt: string
  updatedAt: string
}

interface Template {
  id: string
  name: string
  description: string
  components: Omit<ElectronicComponent, 'id' | 'icon'>[]
  connections: Omit<Connection, 'id'>[]
}

const componentTypes = [
  { type: "microcontroller", name: "Microcontrôleur", icon: <Microchip className="w-6 h-6" />, description: "Cerveau du circuit" },
  { type: "power", name: "Alimentation", icon: <Zap className="w-6 h-6" />, description: "Source d'énergie" },
  { type: "sensor", name: "Capteur", icon: <Radio className="w-6 h-6" />, description: "Detection et mesure" },
  { type: "processor", name: "Processeur", icon: <Cpu className="w-6 h-6" />, description: "Unité de traitement" },
  { type: "battery", name: "Batterie", icon: <Battery className="w-6 h-6" />, description: "Stockage d'énergie" },
  { type: "wireless", name: "Sans fil", icon: <Wifi className="w-6 h-6" />, description: "Communication sans fil" },
  { type: "bluetooth", name: "Bluetooth", icon: <Bluetooth className="w-6 h-6" />, description: "Communication Bluetooth" },
  { type: "usb", name: "USB", icon: <Usb className="w-6 h-6" />, description: "Interface USB" }
]

const templates: Template[] = [
  {
    id: "basic-led",
    name: "Circuit LED de base",
    description: "Circuit simple avec alimentation, LED et résistance",
    components: [
      { type: "power", name: "Alimentation", description: "Source d'énergie", x: 200, y: 200 },
      { type: "sensor", name: "LED", description: "Diode électroluminescente", x: 400, y: 200 }
    ],
    connections: [
      { fromComponentId: "power", toComponentId: "sensor", type: "power" }
    ]
  },
  {
    id: "microcontroller-system",
    name: "Système microcontrôleur",
    description: "Microcontrôleur avec capteurs et communication",
    components: [
      { type: "microcontroller", name: "Microcontrôleur", description: "Cerveau du circuit", x: 400, y: 300 },
      { type: "power", name: "Alimentation", description: "Source d'énergie", x: 200, y: 200 },
      { type: "sensor", name: "Capteur", description: "Detection et mesure", x: 600, y: 200 },
      { type: "wireless", name: "WiFi", description: "Communication sans fil", x: 600, y: 400 }
    ],
    connections: [
      { fromComponentId: "power", toComponentId: "microcontroller", type: "power" },
      { fromComponentId: "sensor", toComponentId: "microcontroller", type: "data" },
      { fromComponentId: "microcontroller", toComponentId: "wireless", type: "data" }
    ]
  },
  {
    id: "iot-device",
    name: "Appareil IoT",
    description: "Appareil IoT complet avec capteurs et connectivité",
    components: [
      { type: "microcontroller", name: "Microcontrôleur", description: "Cerveau du circuit", x: 400, y: 300 },
      { type: "power", name: "Alimentation", description: "Source d'énergie", x: 200, y: 200 },
      { type: "battery", name: "Batterie", description: "Stockage d'énergie", x: 200, y: 400 },
      { type: "sensor", name: "Capteur", description: "Detection et mesure", x: 600, y: 200 },
      { type: "wifi", name: "WiFi", description: "Communication sans fil", x: 600, y: 300 },
      { type: "bluetooth", name: "Bluetooth", description: "Communication Bluetooth", x: 600, y: 400 },
      { type: "usb", name: "USB", description: "Interface USB", x: 400, y: 500 }
    ],
    connections: [
      { fromComponentId: "power", toComponentId: "microcontroller", type: "power" },
      { fromComponentId: "battery", toComponentId: "microcontroller", type: "power" },
      { fromComponentId: "sensor", toComponentId: "microcontroller", type: "data" },
      { fromComponentId: "microcontroller", toComponentId: "wifi", type: "data" },
      { fromComponentId: "microcontroller", toComponentId: "bluetooth", type: "data" },
      { fromComponentId: "microcontroller", toComponentId: "usb", type: "data" }
    ]
  }
]

export default function Home() {
  const [components, setComponents] = useState<ElectronicComponent[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [draggingComponent, setDraggingComponent] = useState<string | null>(null)
  const [connectionMode, setConnectionMode] = useState(false)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const [editingComponent, setEditingComponent] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: '', description: '' })
  const [showTemplates, setShowTemplates] = useState(false)
  const [projectName, setProjectName] = useState("Nouveau Projet Électronique")
  const [projectDescription, setProjectDescription] = useState("")

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData("componentType", componentType)
    setSelectedComponent(componentType)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const componentType = e.dataTransfer.getData("componentType")
    
    if (componentType) {
      const componentTypeDef = componentTypes.find(c => c.type === componentType)
      if (componentTypeDef) {
        const newComponent: ElectronicComponent = {
          id: `${componentType}-${Date.now()}`,
          type: componentType,
          name: componentTypeDef.name,
          description: componentTypeDef.description,
          x,
          y,
          icon: componentTypeDef.icon
        }
        setComponents([...components, newComponent])
      }
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only handle click if not dragging
    if (!e.defaultPrevented) {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      if (selectedComponent) {
        const componentType = componentTypes.find(c => c.type === selectedComponent)
        if (componentType) {
          const newComponent: ElectronicComponent = {
            id: `${selectedComponent}-${Date.now()}`,
            type: selectedComponent,
            name: componentType.name,
            description: componentType.description,
            x,
            y,
            icon: componentType.icon
          }
          setComponents([...components, newComponent])
        }
      }
    }
  }

  const handleDeleteComponent = (id: string) => {
    setComponents(components.filter(c => c.id !== id))
  }

  const handleComponentDragStart = (e: React.DragEvent, componentId: string) => {
    e.dataTransfer.setData("componentId", componentId)
    setDraggingComponent(componentId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleComponentDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const componentId = e.dataTransfer.getData("componentId")
    
    if (componentId) {
      setComponents(components.map(c => 
        c.id === componentId ? { ...c, x, y } : c
      ))
    }
    setDraggingComponent(null)
  }

  const handleComponentClick = (componentId: string) => {
    if (connectionMode) {
      if (!connectingFrom) {
        setConnectingFrom(componentId)
      } else if (connectingFrom !== componentId) {
        // Create connection
        const newConnection: Connection = {
          id: `conn-${Date.now()}`,
          fromComponentId: connectingFrom,
          toComponentId: componentId,
          type: 'data' // Default type
        }
        setConnections([...connections, newConnection])
        setConnectingFrom(null)
      }
    } else {
      // Select component for editing
      const component = components.find(c => c.id === componentId)
      if (component) {
        setSelectedComponent(componentId)
        setEditForm({ name: component.name, description: component.description })
      }
    }
  }

  const handleEditComponent = (componentId: string) => {
    setEditingComponent(componentId)
    const component = components.find(c => c.id === componentId)
    if (component) {
      setEditForm({ name: component.name, description: component.description })
    }
  }

  const handleSaveEdit = () => {
    if (editingComponent) {
      setComponents(components.map(c => 
        c.id === editingComponent 
          ? { ...c, name: editForm.name, description: editForm.description }
          : c
      ))
      setEditingComponent(null)
    }
  }

  const handleCancelEdit = () => {
    setEditingComponent(null)
    setEditForm({ name: '', description: '' })
  }

  const loadTemplate = (template: Template) => {
    const newComponents: ElectronicComponent[] = template.components.map(comp => {
      const compType = componentTypes.find(ct => ct.type === comp.type)
      return {
        ...comp,
        id: `${comp.type}-${Date.now()}-${Math.random()}`,
        icon: compType?.icon || <Microchip className="w-6 h-6" />
      }
    })
    
    const newConnections: Connection[] = template.connections.map((conn, index) => {
      // Map the template component references to actual component IDs
      const fromComp = newComponents.find(c => c.type === conn.fromComponentId)
      const toComp = newComponents.find(c => c.type === conn.toComponentId)
      
      if (fromComp && toComp) {
        return {
          ...conn,
          id: `conn-${Date.now()}-${index}`,
          fromComponentId: fromComp.id,
          toComponentId: toComp.id
        }
      }
      return conn
    }).filter(conn => 
      newComponents.some(c => c.id === conn.fromComponentId) && 
      newComponents.some(c => c.id === conn.toComponentId)
    ) as Connection[]
    
    setComponents(newComponents)
    setConnections(newConnections)
    setProjectName(template.name)
    setProjectDescription(template.description)
    setShowTemplates(false)
  }

  const handleDeleteConnection = (connectionId: string) => {
    setConnections(connections.filter(c => c.id !== connectionId))
  }

  const getConnectionPath = (from: ElectronicComponent, to: ElectronicComponent) => {
    const dx = to.x - from.x
    const dy = to.y - from.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    // Create a curved path
    const controlPointOffset = distance * 0.2
    const controlX1 = from.x + controlPointOffset
    const controlY1 = from.y
    const controlX2 = to.x - controlPointOffset
    const controlY2 = to.y
    
    return `M ${from.x} ${from.y} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${to.x} ${to.y}`
  }

  const saveProject = () => {
    const project: Project = {
      id: `project-${Date.now()}`,
      name: projectName,
      description: projectDescription,
      components: components.map(c => ({
        ...c,
        icon: undefined // Remove React nodes from serialization
      })) as ElectronicComponent[],
      connections,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Save to localStorage
    const savedProjects = JSON.parse(localStorage.getItem('electronic-projects') || '[]')
    const existingIndex = savedProjects.findIndex((p: Project) => p.name === projectName)
    
    if (existingIndex >= 0) {
      savedProjects[existingIndex] = project
    } else {
      savedProjects.push(project)
    }
    
    localStorage.setItem('electronic-projects', JSON.stringify(savedProjects))
    
    // Show success message
    alert('Projet sauvegardé avec succès!')
  }

  const loadProject = () => {
    const savedProjects = JSON.parse(localStorage.getItem('electronic-projects') || '[]')
    if (savedProjects.length === 0) {
      alert('Aucun projet sauvegardé trouvé.')
      return
    }
    
    // Simple prompt for project selection (in a real app, you'd use a modal)
    const projectNames = savedProjects.map((p: Project) => p.name).join('\n')
    const selectedName = prompt(`Sélectionnez un projet:\n${projectNames}`)
    
    if (selectedName) {
      const project = savedProjects.find((p: Project) => p.name === selectedName)
      if (project) {
        setProjectName(project.name)
        setProjectDescription(project.description)
        setComponents(project.components.map(c => ({
          ...c,
          icon: componentTypes.find(ct => ct.type === c.type)?.icon || <Microchip className="w-6 h-6" />
        })))
        setConnections(project.connections)
        alert('Projet chargé avec succès!')
      }
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <h2 className="text-lg font-semibold">Composants Électroniques</h2>
            <p className="text-sm text-muted-foreground">Glisser-déposer sur le canvas</p>
          </SidebarHeader>
          <SidebarContent>
            <div className="p-4 space-y-2">
              {componentTypes.map((component) => (
                <Card 
                  key={component.type}
                  draggable
                  className={`cursor-grab transition-colors hover:bg-accent ${
                    selectedComponent === component.type ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedComponent(component.type)}
                  onDragStart={(e) => handleDragStart(e, component.type)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="text-primary">
                      {component.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{component.name}</h3>
                      <p className="text-xs text-muted-foreground">{component.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="text-lg font-semibold"
                />
                <Badge variant="outline">Conceptuel</Badge>
                <Button
                  variant={connectionMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setConnectionMode(!connectionMode)
                    setConnectingFrom(null)
                  }}
                >
                  {connectionMode ? <MousePointer className="w-4 h-4 mr-2" /> : <Link2 className="w-4 h-4 mr-2" />}
                  {connectionMode ? "Mode Sélection" : "Mode Connexion"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowTemplates(true)}>
                  <LayoutTemplate className="w-4 h-4 mr-2" />
                  Templates
                </Button>
                <Button variant="outline" size="sm" onClick={loadProject}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Ouvrir
                </Button>
                <Button variant="outline" size="sm" onClick={saveProject}>
                  <Save className="w-4 h-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
            <Textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Description du projet..."
              className="mt-2"
              rows={2}
            />
          </header>

          {/* Canvas Area */}
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={75}>
              <div 
                className="flex-1 relative bg-grid-slate-100 dark:bg-grid-slate-800 bg-[length:40px_40px] cursor-crosshair overflow-hidden"
                onClick={handleCanvasClick}
                onDrop={(e) => {
                  if (e.dataTransfer.getData("componentId")) {
                    handleComponentDrop(e)
                  } else {
                    handleDrop(e)
                  }
                }}
                onDragOver={handleDragOver}
              >
                {/* SVG overlay for connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {connections.map((connection) => {
                    const fromComponent = components.find(c => c.id === connection.fromComponentId)
                    const toComponent = components.find(c => c.id === connection.toComponentId)
                    if (!fromComponent || !toComponent) return null
                    
                    return (
                      <g key={connection.id}>
                        <path
                          d={getConnectionPath(fromComponent, toComponent)}
                          stroke={connection.type === 'power' ? '#ef4444' : 
                                 connection.type === 'ground' ? '#6b7280' : 
                                 connection.type === 'signal' ? '#f59e0b' : '#3b82f6'}
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray={connection.type === 'ground' ? '5,5' : 'none'}
                        />
                        <circle
                          cx={fromComponent.x}
                          cy={fromComponent.y}
                          r="4"
                          fill={connection.type === 'power' ? '#ef4444' : 
                                connection.type === 'ground' ? '#6b7280' : 
                                connection.type === 'signal' ? '#f59e0b' : '#3b82f6'}
                        />
                        <circle
                          cx={toComponent.x}
                          cy={toComponent.y}
                          r="4"
                          fill={connection.type === 'power' ? '#ef4444' : 
                                connection.type === 'ground' ? '#6b7280' : 
                                connection.type === 'signal' ? '#f59e0b' : '#3b82f6'}
                        />
                      </g>
                    )
                  })}
                </svg>
                
                {components.map((component) => (
                  <Card
                    key={component.id}
                    draggable
                    className={`absolute w-32 h-20 cursor-move shadow-md hover:shadow-lg transition-shadow ${
                      draggingComponent === component.id ? 'opacity-50' : ''
                    } ${connectingFrom === component.id ? 'ring-2 ring-blue-500' : ''} ${
                      selectedComponent === component.id ? 'ring-2 ring-green-500' : ''
                    }`}
                    style={{ left: component.x - 64, top: component.y - 40 }}
                    onDragStart={(e) => handleComponentDragStart(e, component.id)}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleComponentClick(component.id)
                    }}
                  >
                    <CardContent className="p-2 h-full flex flex-col items-center justify-center">
                      <div className="text-primary mb-1">
                        {component.icon}
                      </div>
                      <div className="text-xs text-center">
                        <div className="font-medium">{component.name}</div>
                        <div className="text-muted-foreground">{component.description}</div>
                      </div>
                      <div className="absolute -top-2 -right-2 flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 bg-white shadow-md"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditComponent(component.id)
                          }}
                        >
                          <Edit3 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-6 h-6 p-0 bg-white shadow-md"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteComponent(component.id)
                          }}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {connectionMode && connectingFrom && (
                  <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-md text-sm">
                    Cliquez sur un deuxième composant pour créer une connexion
                  </div>
                )}
                {connectionMode && !connectingFrom && (
                  <div className="absolute bottom-4 left-4 bg-blue-500 text-white px-3 py-2 rounded-md text-sm">
                    Cliquez sur un composant pour commencer une connexion
                  </div>
                )}
                {selectedComponent && !connectionMode && (
                  <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground px-3 py-2 rounded-md text-sm">
                    Cliquez pour placer: {componentTypes.find(c => c.type === selectedComponent)?.name}
                  </div>
                )}
              </div>
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={25}>
              <div className="p-4 h-full overflow-y-auto">
                <h3 className="font-semibold mb-4">Propriétés</h3>
                {connectionMode ? (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Link2 className="w-4 h-4" />
                        Mode Connexion
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">
                        Cliquez sur deux composants pour les connecter. Les connexions représentent les flux de données, d'alimentation ou de signaux entre les composants.
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-0.5 bg-blue-500"></div>
                          <span>Données</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-0.5 bg-red-500"></div>
                          <span>Alimentation</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-0.5 bg-yellow-500"></div>
                          <span>Signal</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <div className="w-4 h-0.5 bg-gray-500 border-dashed border border-gray-500"></div>
                          <span>Terre</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : selectedComponent ? (
                  (() => {
                    const component = components.find(c => c.id === selectedComponent)
                    if (!component) return null
                    
                    return (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center justify-between">
                            {component.name}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditComponent(component.id)}
                            >
                              <Edit3 className="w-4 h-4" />
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {component.description}
                          </p>
                          <div className="space-y-2">
                            <div className="text-xs">
                              <strong>Type:</strong> {component.type}
                            </div>
                            <div className="text-xs">
                              <strong>Position:</strong> ({Math.round(component.x)}, {Math.round(component.y)})
                            </div>
                            <Button variant="outline" size="sm" className="w-full mt-4">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Éditer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })()
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Sélectionnez un composant ou un élément sur le canvas pour voir ses propriétés.
                    </p>
                    {connections.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">Connexions ({connections.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {connections.map((connection) => {
                              const fromComp = components.find(c => c.id === connection.fromComponentId)
                              const toComp = components.find(c => c.id === connection.toComponentId)
                              return (
                                <div key={connection.id} className="flex items-center justify-between p-2 bg-muted rounded">
                                  <div className="text-xs">
                                    {fromComp?.name} → {toComp?.name}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-6 h-6 p-0"
                                    onClick={() => handleDeleteConnection(connection.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
      
      {/* Edit Component Dialog */}
      <Dialog open={!!editingComponent} onOpenChange={(open) => !open && handleCancelEdit()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Éditer le composant</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="component-name">Nom</Label>
              <Input
                id="component-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                placeholder="Nom du composant"
              />
            </div>
            <div>
              <Label htmlFor="component-description">Description</Label>
              <Textarea
                id="component-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                placeholder="Description du composant"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelEdit}>
              <X className="w-4 h-4 mr-2" />
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              <Save className="w-4 h-4 mr-2" />
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Templates Dialog */}
      <Dialog open={showTemplates} onOpenChange={(open) => !open && setShowTemplates(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Templates de Schémas Électroniques</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choisissez un template pour commencer rapidement votre projet électronique.
            </p>
            <div className="grid grid-cols-1 gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id}
                  className="cursor-pointer transition-colors hover:bg-accent"
                  onClick={() => loadTemplate(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>{template.components.length} composants</span>
                          <span>{template.connections.length} connexions</span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Utiliser
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplates(false)}>
              Annuler
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}