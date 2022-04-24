import {DOMHelper} from '../Utility/DOMHelper.js';
import {Tooltip} from './Tooltip.js';

export class ProjectItem {
  constructor(id, type, switchProjectHandler) {
    this.id = id;
    this.type = type;
    this.ProjectList_switchProject = switchProjectHandler;
    this.hasTooltip = false;
    this.connectSwithButton(type);
    this.connetMoreInfoButton();
    this.connectDrag();
  }

  switchMoreInfo(type) {
    if (type === 'show') {
      if (!this.hasTooltip) {
        const projectElement = document.querySelector(`#${this.id}`);
        const infoText = projectElement.dataset.extraInfo;
        const tooltip = new Tooltip(
            this.switchMoreInfo.bind(this),
            infoText,
            this.id,
        );
        this.hasTooltip = tooltip.attach(this.hasTooltip);
      }
    } else if (type === 'hide') {
      this.hasTooltip = false;
    }
  }

  connetMoreInfoButton() {
    const moreInfoButton = document.querySelector(
        `#${this.id} button:first-of-type`,
    );
    moreInfoButton.addEventListener(
        'click',
        this.switchMoreInfo.bind(this, 'show'),
    );
  }

  connectDrag() {
    const item = document.querySelector(`#${this.id}`);

    item.addEventListener('dragstart', (event) => {
      // este evento se ejecuta cuando se toca el elemento y se intenta mover
      event.dataTransfer.setData('text/plain', this.id); // guardo en el evento el Id del elemento que se mueve
      event.dataTransfer.effectAllowed = 'move'; // declaro que la operacion a relizar es una movida
    });

    item.addEventListener('dragend', (event) => {
      // aqui es importante dentro de datatransfer ver el valor de dropEffect el cual es none si se suelta en un lugar no permitido
    });
  }

  connectSwithButton(type) {
    let swithSwithButton = document.querySelector(
        `#${this.id} button:last-of-type`,
    );
    swithSwithButton = DOMHelper.clearEventListeners(swithSwithButton);
    swithSwithButton.textContent =
            type === 'active' ? 'Finish' : 'Activate';
    swithSwithButton.addEventListener(
        'click',
        this.ProjectList_switchProject.bind(null, this.id),
    );
  }

  update(UpdatedProjectList_switchProject, type) {
    this.type = type;
    this.ProjectList_switchProject = UpdatedProjectList_switchProject;
    this.connectSwithButton(type);
  }
}
