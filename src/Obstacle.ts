export default class Obstacle {
  ObstacleType: Number;
  ObstacleHtmlElem: HTMLDivElement;
  ObstaclePosition: Number;

  constructor() {
    this.ObstacleType = 1;
    this.ObstacleHtmlElem = document.createElement('div');
    this.ObstacleHtmlElem.classList.add('obstacle');
    this.ObstaclePosition = 0;

    this.ObstacleHtmlElem.style.right = this.ObstaclePosition.toString() + 'px';
  }

  destroy() {
    if (this.ObstacleHtmlElem.parentNode) {
      this.ObstacleHtmlElem.parentNode.removeChild(this.ObstacleHtmlElem);
    }
  }
}