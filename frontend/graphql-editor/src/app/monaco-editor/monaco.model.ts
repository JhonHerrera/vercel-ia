export const ProductosDetailColumns = [
	{ type: 'number', show: false, label: `ID`, key: 'id', pipe: '', argsPipe: ['']},
	{ type: 'string', show: true, label: `Nombre`, key: 'nombre'},
	{ type: 'string', show: false, label: `Descripcion`, key: 'descripcion'},
	{ type: 'string', show: false, label: `Estado`, key: 'estado'},
	{ type: 'string', show: false, label: 'Accion', key: 'accion'}
]

export const AplicacionesDetailColumns = [
	{ type: 'number', show: false, label: `ID`, key: 'id', pipe: '', argsPipe: ['']},
	{ type: 'number', show: false, label: `ID Producto`, key: 'idproducto'},
	{ type: 'string', show: true, label: `Nombre`, key: 'nombre'},
	{ type: 'string', show: false, label: `Descripcion`, key: 'descripcion'},
	{ type: 'string', show: false, label: `Directorio`, key: 'directorio'},
	{ type: 'string', show: false, label: `Alias`, key: 'alias'}
]

export const ProyectosDetailColumns = [
	{ type: 'number', show: false, label: `ID`, key: 'id', pipe: '', argsPipe: ['']},
	{ type: 'number', show: false, label: `ID Producto`, key: 'idproducto'},
	{ type: 'number', show: false, label: `ID Aplicacion`, key: 'aplicacion'},
	{ type: 'string', show: true, label: `Nombre`, key: 'nombre'},
	{ type: 'string', show: false, label: `Descripcion`, key: 'descripcion'},
	{ type: 'string', show: false, label: `Estado`, key: 'estado'}
]

export const reporterDetail = [
    { "label": "Productos", "key": "prd", "columns": ProductosDetailColumns},
    { "label": "Aplicaciones", "key": "apl", "columns": AplicacionesDetailColumns},
    { "label": "Proyectos", "key": "pro", "columns": ProyectosDetailColumns}
]

export const graphQLSchema = {
    
}

export interface RowDetailColumnInterface {
	type: string
	label: string
	key: string
	show: boolean
	nav?: any
	pipe?: string
	argsPipe?: any
	ng_style_?: any
	table_key?: string
	table_label?: string
	align?: string
  }
  
  export interface TablesInterface {
	label: string,
	key: string,
	columns: RowDetailColumnInterface[]
  }
  


