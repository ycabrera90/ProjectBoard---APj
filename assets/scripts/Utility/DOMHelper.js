class DOMHelper {
    static moveElement(elementId, newDestinations) {
        const elementToAdd = document.querySelector(`#${elementId}`);
        newDestinations.appendChild(elementToAdd);
        elementToAdd.scrollIntoView({ behavior: 'smooth' });
    }
    static clearEventListeners(element) {
        const clonedElement = element.cloneNode(true);
        element.replaceWith(clonedElement);
        return clonedElement;
    }
}
