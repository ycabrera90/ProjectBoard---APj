'use strict';
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
