export class Tooltip {
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
        // tooltipElement.style.left = hostElPosLeft + `px`;
        // tooltipElement.style.top = hostElPosTop + `px`;


        tooltipElement.addEventListener('click', this.detach.bind(this));
        this.element = tooltipElement;
    }

    attach(hasTooltip) {
        if (hasTooltip) {
            return;
        }
        document.body.append(this.element);
        return true;
    }
}
