import colors from 'colors';
import { guardarDB, leerDB } from './helpers/guardarArchivo.js';
import { confirmar, inquirerMenu, leerInput, listadoTareasBorrar, mostrarListadoChecklist, pausa } from './helpers/inquirer.js';
import { Tarea } from './models/tarea.js';
import { Tareas } from './models/tareas.js';

console.clear();

const main = async() => {

    let opt = '';
    const tareas = new Tareas();

    const tareasDB = leerDB();

    if ( tareasDB ) {
        //cargo las tareas
        tareas.cargarTareasFromArray( tareasDB );
    }

    do {
        //imprime el menú
        opt = await inquirerMenu();

        switch (opt) {
            case '1':
                //crea la tarea
                const desc = await leerInput('Descripción: ');
                tareas.crearTarea( desc );
            break;

            case '2':
                tareas.listadoCompleto();
            
            break;

            case '3':
                // listado completados
                tareas.listarPendientesCompletadas(true);
            break;

            case '4':
                tareas.listarPendientesCompletadas(false);
            break;

            case '5':
                const ids = await mostrarListadoChecklist( tareas.listadoArr );
                tareas.toggleCompletadas( ids );
            break;

            case '6':
                const id = await listadoTareasBorrar( tareas.listadoArr );
                if ( id!== 0 ) {
                    const ok = await confirmar('¿Estás seguro?');
                    if ( ok ) {
                        tareas.borrarTarea( id );
                        console.log('Tarea borrada correctamente!');
                    }
                }
            break;

            default:
                break;
        }
       
        guardarDB( tareas.listadoArr );

        await pausa();
        
    } while ( opt !== '0' );



}

main();