import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Mail, 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  FileText, 
  Scale, 
  Building, 
  Users,
  Search,
  Filter,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Send,
  Calendar,
  Tag
} from 'lucide-react'
import './App.css'

// Datos de ejemplo para simular correos analizados
const correosEjemplo = [
  {
    id: 1,
    asunto: "Recurso de protección contra municipalidad - URGENTE",
    remitente: "Tribunal de Justicia de Monte Patria",
    fecha: "2025-09-04 14:30",
    categoria: "recursos_judiciales",
    prioridad: 1,
    estado: "pendiente",
    plazoRespuesta: "2025-09-05 18:00",
    contenido: "Se ha interpuesto recurso de protección contra acto administrativo municipal. Plazo de 5 días hábiles para responder.",
    palabrasClave: ["recurso", "protección", "tribunal", "plazo"],
    normativaAplicable: ["Código de Procedimiento Civil", "Ley N° 18.695"],
    accionesSugeridas: ["Revisar expediente", "Coordinar con alcaldía", "Preparar defensa"]
  },
  {
    id: 2,
    asunto: "Consulta sobre licitación de obras municipales",
    remitente: "Constructora Los Andes Ltda.",
    fecha: "2025-09-04 10:15",
    categoria: "contratos_licitaciones",
    prioridad: 2,
    estado: "en_proceso",
    plazoRespuesta: "2025-09-09 17:00",
    contenido: "Solicito información sobre bases técnicas de licitación para construcción de plaza pública.",
    palabrasClave: ["licitación", "bases", "construcción", "obra"],
    normativaAplicable: ["Ley N° 19.886", "Decreto N° 250/2004"],
    accionesSugeridas: ["Revisar bases técnicas", "Coordinar con área técnica"]
  },
  {
    id: 3,
    asunto: "Denuncia funcionario municipal - Investigación requerida",
    remitente: "Director de Control Interno",
    fecha: "2025-09-04 09:45",
    categoria: "procedimientos_disciplinarios",
    prioridad: 1,
    estado: "respondido",
    plazoRespuesta: "2025-09-06 12:00",
    contenido: "Se requiere iniciar investigación sumaria por irregularidades detectadas en funcionario del área de obras.",
    palabrasClave: ["denuncia", "investigación", "sumaria", "funcionario"],
    normativaAplicable: ["Ley N° 18.883", "Ley N° 19.880"],
    accionesSugeridas: ["Evaluar gravedad", "Designar fiscal", "Iniciar procedimiento"]
  },
  {
    id: 4,
    asunto: "Solicitud de acceso a información pública",
    remitente: "ciudadano@email.com",
    fecha: "2025-09-03 16:20",
    categoria: "transparencia_acceso",
    prioridad: 3,
    estado: "pendiente",
    plazoRespuesta: "2025-09-23 17:00",
    contenido: "Solicito información sobre contratos suscritos por la municipalidad durante el año 2024.",
    palabrasClave: ["transparencia", "información", "contratos", "2024"],
    normativaAplicable: ["Ley N° 20.285"],
    accionesSugeridas: ["Verificar información", "Revisar excepciones", "Preparar respuesta"]
  }
]

const categorias = {
  recursos_judiciales: { nombre: "Recursos Judiciales", color: "bg-red-500", icon: Scale },
  contratos_licitaciones: { nombre: "Contratos y Licitaciones", color: "bg-blue-500", icon: FileText },
  procedimientos_disciplinarios: { nombre: "Procedimientos Disciplinarios", color: "bg-orange-500", icon: Users },
  transparencia_acceso: { nombre: "Transparencia y Acceso", color: "bg-green-500", icon: Building },
  consultas_generales: { nombre: "Consultas Generales", color: "bg-gray-500", icon: Mail }
}

const prioridades = {
  1: { nombre: "CRÍTICO", color: "bg-red-600 text-white", textColor: "text-red-600" },
  2: { nombre: "ALTO", color: "bg-orange-500 text-white", textColor: "text-orange-500" },
  3: { nombre: "MEDIO", color: "bg-yellow-500 text-white", textColor: "text-yellow-600" },
  4: { nombre: "BAJO", color: "bg-green-500 text-white", textColor: "text-green-600" }
}

const estados = {
  pendiente: { nombre: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  en_proceso: { nombre: "En Proceso", color: "bg-blue-100 text-blue-800", icon: FileText },
  respondido: { nombre: "Respondido", color: "bg-green-100 text-green-800", icon: CheckCircle }
}

function App() {
  const [correos, setCorreos] = useState(correosEjemplo)
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null)
  const [filtroCategoria, setFiltroCategoria] = useState("todas")
  const [filtroPrioridad, setFiltroPrioridad] = useState("todas")
  const [filtroEstado, setFiltroEstado] = useState("todos")
  const [busqueda, setBusqueda] = useState("")
  const [vistaActual, setVistaActual] = useState("dashboard")

  // Filtrar correos
  const correosFiltrados = correos.filter(correo => {
    const coincideBusqueda = correo.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
                            correo.remitente.toLowerCase().includes(busqueda.toLowerCase())
    const coincideCategoria = filtroCategoria === "todas" || correo.categoria === filtroCategoria
    const coincidePrioridad = filtroPrioridad === "todas" || correo.prioridad.toString() === filtroPrioridad
    const coincideEstado = filtroEstado === "todos" || correo.estado === filtroEstado
    
    return coincideBusqueda && coincideCategoria && coincidePrioridad && coincideEstado
  })

  // Estadísticas
  const estadisticas = {
    total: correos.length,
    criticos: correos.filter(c => c.prioridad === 1).length,
    pendientes: correos.filter(c => c.estado === "pendiente").length,
    vencidos: correos.filter(c => new Date(c.plazoRespuesta) < new Date()).length
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-CL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const analizarCorreo = (asunto, contenido, remitente) => {
    // Simulación del análisis automático
    const nuevoCorreo = {
      id: correos.length + 1,
      asunto,
      remitente,
      fecha: new Date().toISOString(),
      categoria: "consultas_generales",
      prioridad: 3,
      estado: "pendiente",
      plazoRespuesta: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      contenido,
      palabrasClave: ["consulta", "información"],
      normativaAplicable: ["Normativa general"],
      accionesSugeridas: ["Analizar consulta", "Preparar respuesta"]
    }
    
    setCorreos([nuevoCorreo, ...correos])
    setVistaActual("dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Scale className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Sistema de Análisis de Correos Jurídicos</h1>
                <p className="text-sm text-gray-500">Municipalidad de Monte Patria</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                variant={vistaActual === "dashboard" ? "default" : "outline"}
                onClick={() => setVistaActual("dashboard")}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
              <Button 
                variant={vistaActual === "analizar" ? "default" : "outline"}
                onClick={() => setVistaActual("analizar")}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Analizar Correo</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vistaActual === "dashboard" && (
          <>
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Correos</CardTitle>
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estadisticas.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Críticos</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{estadisticas.criticos}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">{estadisticas.vencidos}</div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros y búsqueda */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Filtros y Búsqueda</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="busqueda">Buscar</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="busqueda"
                        placeholder="Buscar por asunto o remitente..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las categorías</SelectItem>
                        {Object.entries(categorias).map(([key, cat]) => (
                          <SelectItem key={key} value={key}>{cat.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Prioridad</Label>
                    <Select value={filtroPrioridad} onValueChange={setFiltroPrioridad}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas las prioridades</SelectItem>
                        {Object.entries(prioridades).map(([key, prio]) => (
                          <SelectItem key={key} value={key}>{prio.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los estados</SelectItem>
                        {Object.entries(estados).map(([key, estado]) => (
                          <SelectItem key={key} value={key}>{estado.nombre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de correos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Correos Analizados ({correosFiltrados.length})</h2>
                {correosFiltrados.map((correo) => {
                  const categoria = categorias[correo.categoria]
                  const prioridad = prioridades[correo.prioridad]
                  const estado = estados[correo.estado]
                  const IconoCategoria = categoria.icon
                  const IconoEstado = estado.icon
                  
                  return (
                    <Card 
                      key={correo.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        correoSeleccionado?.id === correo.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setCorreoSeleccionado(correo)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-sm font-medium line-clamp-2">
                              {correo.asunto}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {correo.remitente}
                            </CardDescription>
                          </div>
                          <Badge className={prioridad.color}>
                            {prioridad.nombre}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-1">
                              <IconoCategoria className="h-4 w-4 text-gray-500" />
                              <span className="text-xs text-gray-500">{categoria.nombre}</span>
                            </div>
                            <Badge variant="outline" className={estado.color}>
                              <IconoEstado className="h-3 w-3 mr-1" />
                              {estado.nombre}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>{formatearFecha(correo.fecha)}</span>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  )
                })}
              </div>

              {/* Detalle del correo seleccionado */}
              <div className="sticky top-4">
                {correoSeleccionado ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Detalle del Correo</CardTitle>
                        <Button size="sm" className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>Ver Completo</span>
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Asunto</h4>
                        <p className="text-sm">{correoSeleccionado.asunto}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Remitente</h4>
                        <p className="text-sm">{correoSeleccionado.remitente}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Contenido</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">{correoSeleccionado.contenido}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Palabras Clave Detectadas</h4>
                        <div className="flex flex-wrap gap-1">
                          {correoSeleccionado.palabrasClave.map((palabra, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {palabra}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Plazo de Respuesta</h4>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{formatearFecha(correoSeleccionado.plazoRespuesta)}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Acciones Sugeridas</h4>
                        <ul className="text-sm space-y-1">
                          {correoSeleccionado.accionesSugeridas.map((accion, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-green-500" />
                              <span>{accion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-2">Normativa Aplicable</h4>
                        <ul className="text-sm space-y-1">
                          {correoSeleccionado.normativaAplicable.map((norma, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <Scale className="h-3 w-3 text-blue-500" />
                              <span>{norma}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button className="w-full flex items-center space-x-2">
                          <Send className="h-4 w-4" />
                          <span>Generar Respuesta Sugerida</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="flex items-center justify-center h-64">
                      <div className="text-center text-gray-500">
                        <Mail className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Selecciona un correo para ver los detalles</p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}

        {vistaActual === "analizar" && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5" />
                <span>Analizar Nuevo Correo</span>
              </CardTitle>
              <CardDescription>
                Ingresa los datos del correo para realizar el análisis automático
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                analizarCorreo(
                  formData.get('asunto'),
                  formData.get('contenido'),
                  formData.get('remitente')
                )
              }} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="remitente">Remitente</Label>
                  <Input
                    id="remitente"
                    name="remitente"
                    placeholder="Ej: tribunal@justicia.cl"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="asunto">Asunto</Label>
                  <Input
                    id="asunto"
                    name="asunto"
                    placeholder="Ej: Recurso de protección contra municipalidad"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contenido">Contenido del Correo</Label>
                  <Textarea
                    id="contenido"
                    name="contenido"
                    placeholder="Ingresa el contenido completo del correo electrónico..."
                    rows={8}
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button type="submit" className="flex-1">
                    Analizar Correo
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setVistaActual("dashboard")}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default App

