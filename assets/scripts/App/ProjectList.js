import { ProjectItem } from './ProjectItem.js';
import { DOMHelper } from '../Utility/DOMHelper.js';

export class ProjectList {
    projects = [];
    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${this.type}-projects li`);

        for (const prjItem of prjItems) {
            this.projects.push(
                new ProjectItem(prjItem.id, type, this.switchProject.bind(this))
            );
        }
        this.connetDroppable();
    }

    connetDroppable() {
        const list = document.querySelector(`#${this.type}-projects ul`);
        list.addEventListener('dragenter', (event) => {
            if (event.dataTransfer.types[0] === 'text/plain') {
                // esta condicion se usa para garantizar que el tipo de elemento que vamos a soltar es el adecuado para hacer drop en esta lista
                list.classList.add('droppable');
                event.preventDefault(); // por defecto las litas dejan hacer el drop de elemento pero no dejan desparar listener para el drop
            }
        });
        list.addEventListener('dragover', (event) => {
            if (event.dataTransfer.types[0] === 'text/plain') {
                // esta condicion se usa para garantizar que el tipo de elemento que vamos a soltar es el adecuado para hacer drop en esta lista
                event.preventDefault(); // por defecto las litas dejan hacer el drop de elemento pero no dejan desparar listener para el drop
            }
        });

        list.addEventListener('dragleave', (event) => {
            if (
                event.relatedTarget.closest(`#${this.type}-projects ul`) !==
                list
            ) {
                list.classList.remove('droppable');
            }
        });

        list.addEventListener('drop', (event) => {
            const prjId = event.dataTransfer.getData('text/plain'); // obtengo el id

            // me aseguro de no soltar el elemento en la misma lista
            if (this.projects.find((p) => p.id === prjId)) {
                return;
            }

            // hacemos click en el boton de finalizar ya que realmente hace lo que nosotros necesitamos.
            const buttonEnd = document
                .querySelector(`#${prjId} button:last-of-type`)
                .click();

            list.classList.remove('droppable');

            event.preventDefault(); // solo necesario si se nota algun comportamiento extraño en el navegador
        });
    }

    moveProject(project) {
        const destElement = document.querySelector(`#${this.type}-projects ul`);
        DOMHelper.moveElement(project.id, destElement);
        this.projects.push(project);
        const currProject = this.projects.find((p) => p.id === project.id);
        project.update(this.switchProject.bind(this), this.type);
    }

    setMoveProjectHandler(method) {
        this.moveProjectHandler = method;
    }

    switchProject(projectId) {
        this.moveProjectHandler(this.projects.find((p) => p.id === projectId));
        this.projects = this.projects.filter((p) => p.id !== projectId);
    }
}
