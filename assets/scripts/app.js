'use strict';

class DOMHelper {
    static moveElement(elementId, newDestinations) {
        const elementToAdd = document.querySelector(`#${elementId}`);
        newDestinations.appendChild(elementToAdd);
    }
    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}

class Component {}

class Tooltip {
    constructor(closeNotifierFunction, text) {
        this.text = text;
        this.create();
        this.closeNotifier = closeNotifierFunction;
    }

    detach() {
        this.tooltiElement.remove();
        this.closeNotifier('hide');
    }

    create() {
        this.tooltiElement = document.createElement('div');
        this.tooltiElement.className = 'card';
        this.tooltiElement.textContent = this.text;
        this.tooltiElement.addEventListener('click', this.detach.bind(this));
    }

    attach(hasTooltip) {
        if (hasTooltip) {
            console.log('ya tiene, no se vuelve a crear');
            return;
        }
        document.body.append(this.tooltiElement);
        return true;
    }
}

class ProjectItem {
    constructor(id, type, switchProjectHandler) {
        this.id = id;
        this.type = type;
        this.ProjectList_switchProject = switchProjectHandler;
        this.hasTooltip = false;
        this.infoText;
        this.connectSwithButton(type);
        this.connetMoreInfoButton();
    }

    switchMoreInfo(type) {
        if (type === 'show') {
            if (!this.hasTooltip) {
                const tooltip = new Tooltip(
                    this.switchMoreInfo.bind(this),
                    `this is the info of item ${this.id}`
                );
                this.hasTooltip = tooltip.attach(this.hasTooltip);
            }
        } else if (type === 'hide') {
            this.hasTooltip = false;
        }
    }

    connetMoreInfoButton() {
        const moreInfoButton = document.querySelector(
            `#${this.id} button:first-of-type`
        );
        moreInfoButton.addEventListener(
            'click',
            this.switchMoreInfo.bind(this, 'show')
        );
    }

    connectSwithButton(type) {
        let swithSwithButton = document.querySelector(
            `#${this.id} button:last-of-type`
        );
        swithSwithButton = DOMHelper.clearEventListeners(swithSwithButton);
        swithSwithButton.textContent =
            type === 'active' ? 'Finish' : 'Activate';
        swithSwithButton.addEventListener(
            'click',
            this.ProjectList_switchProject.bind(null, this.id)
        );
    }

    update(UpdatedProjectList_switchProject, type) {
        this.type = type;
        this.ProjectList_switchProject = UpdatedProjectList_switchProject;
        this.connectSwithButton(type);
    }
}

class ProjectList {
    projects = [];
    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(`#${this.type}-projects li`);

        for (const prjItem of prjItems) {
            this.projects.push(
                new ProjectItem(prjItem.id, type, this.switchProject.bind(this))
            );
        }
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

class App {
    static init() {
        const activeProjectList = new ProjectList('active');
        const finishedProjectList = new ProjectList('finished');

        activeProjectList.setMoveProjectHandler(
            finishedProjectList.moveProject.bind(finishedProjectList)
        );

        finishedProjectList.setMoveProjectHandler(
            activeProjectList.moveProject.bind(activeProjectList)
        );
    }
}

App.init();
