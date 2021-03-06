'use strict';
// import { ProjectList } from './App/ProjectList.js';
import { ProjectList } from './UI/ProjectList.js';
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
