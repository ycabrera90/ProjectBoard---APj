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
    constructor(closeNotifierFunction, text, id) {
        this.text = text;
        this.id = id;
        this.closeNotifier = closeNotifierFunction;
        this.create();
    }

    detach() {
        this.element.remove();
        this.closeNotifier('hide');
    }

    create() {
        const tooltipElement = document.createElement('div');
        tooltipElement.className = 'card';
        tooltipElement.textContent = this.text;

        const hostElement = document.querySelector(`#${this.id}`);
        const hostElPosLeft = hostElement.offsetLeft;
        const hostElPosTop = hostElement.offsetTop;
        const hostElHeight = hostElement.clientHeight;
        const parentELementScrolling = hostElement.parentElement.scrollTop;

        const x = hostElPosLeft + 20;
        const y = hostElPosTop + hostElHeight - 10 - parentELementScrolling;

        tooltipElement.style.position = 'absolute';
        tooltipElement.style.left = `${x}px`;
        tooltipElement.style.top = `${y}px`;
        // console.log(parentELementScrolling);
        // tooltipElement.style.left = hostElPosLeft + `px`;
        // tooltipElement.style.top = hostElPosTop + `px`;

        console.log(hostElement);
        console.log(hostElPosLeft, hostElPosTop, hostElHeight);

        tooltipElement.addEventListener('click', this.detach.bind(this));
        this.element = tooltipElement;
    }

    attach(hasTooltip) {
        console.dir(hasTooltip);
        console.dir(this.element);
        if (hasTooltip) {
            return;
        }
        document.body.append(this.element);
        return true;
    }
}

class ProjectItem {
    constructor(id, type, switchProjectHandler) {
        this.id = id;
        this.type = type;
        this.ProjectList_switchProject = switchProjectHandler;
        this.hasTooltip = false;
        this.connectSwithButton(type);
        this.connetMoreInfoButton();
    }

    switchMoreInfo(type) {
        if (type === 'show') {
            if (!this.hasTooltip) {
                const projectElement = document.querySelector(`#${this.id}`);
                const infoText = projectElement.dataset.extraInfo;
                console.log(infoText);
                const tooltip = new Tooltip(
                    this.switchMoreInfo.bind(this),
                    infoText,
                    this.id
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
