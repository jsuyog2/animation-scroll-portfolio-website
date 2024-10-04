import { Component, Input, ViewEncapsulation } from '@angular/core';
import gsap from 'gsap';
import { Draggable, Flip } from 'gsap/all';
@Component({
  selector: 'app-infinite-grid',
  standalone: true,
  imports: [],
  templateUrl: './infinite-grid.component.html',
  styleUrl: './infinite-grid.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class InfiniteGridComponent {
  @Input('data') data: any[] = [];
  containerId: string = "grid-container";
  rowClass: string = 'row'
  divClass: string = 'contentDiv'
  rowNum: number = 0;
  contentNum: number = this.data.length;
  tags: string[] = [];
  titles: any = {
    "collage": 'Collage Projects',
    "latest": 'Latest Projects',
    "old": 'Previous Projects',
    "open": 'Open Source Projects'
  }

  rowMidIndex: any;
  contentMidIndex: any;

  rows: any;
  contentRep: any = [];
  rowArray: any = [];

  lastCenteredElem: any;
  boxWidth: any;
  boxHeight: any;
  gutter: any;
  winMidX: any;
  winMidY: any;

  horizSpacing: any;
  vertSpacing: any;
  horizOffset: any;
  vertOffset: any;

  selectedData: any;

  @Input('useInertia') useInertia = false;
  @Input('useCenterGrid') useCenterGrid = true;
  ngOnInit() {
    this.contentNum = this.data.length;
    this.tags = [...new Set(this.data.map((val: any) => {
      return val.tag;
    }))].sort().reverse();

    this.rowNum = this.tags.length;
  }
  ngAfterViewInit() {
    gsap.registerPlugin(Draggable, Flip);
    this.intialGrid();
  }

  intialGrid() {
    gsap.set(`#${this.containerId}`, { willChange: "transform" });

    this.createImageGrid();
    this.createMask();
    this.lastCenteredElem = document.querySelectorAll(`.${this.divClass}`)[(this.rowMidIndex - 1) * this.contentNum + this.contentMidIndex];

    this.createDraggable();

    this.setStyles();

    this.resize();
    window.addEventListener("resize", () => { this.resize() });
  }
  openContentBox(elems: any, selectedElem: any) {
    gsap.to(selectedElem, { opacity: 0.3, stagger: { amount: 0.7, from: elems.indexOf(selectedElem), grid: "auto" } }).kill(selectedElem);
    gsap.to('.content-box', { backgroundColor: "#888", duration: 1, delay: 0.3 });
  }

  closeContentBox(selectedElem: any) {
    const element: any = document.querySelector('.content-box');
    Flip.fit(element, selectedElem, { scale: true });
    const state = Flip.getState(element);
    gsap.set(element, { clearProps: true });
    gsap.set(element, { xPercent: -50, top: "50%", yPercent: -50, visibility: "visible", overflow: "hidden" });
    Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      scale: true,
      onComplete: function () { gsap.set(element, { overflow: "auto" }) }
    })
      .to(selectedElem, { yPercent: 0 }, 0.2);
  }
  createImageGrid() {
    var maxLength = 4
    for (let y = 0; y < (this.rowNum); y++) {
      const title = this.titles[this.tags[y]]
      const items = this.data.filter(val => val.tag === this.tags[y]);
      maxLength = items.length > maxLength ? items.length : maxLength;
      let row = document.createElement("div");
      row.className = this.rowClass;
      this.contentNum = maxLength;
      for (let x = 0; x < (maxLength); x++) {
        let div = document.createElement("div");
        div.className = this.divClass;
        div.id = `content${y}${x}`;
        const item = items[x % items.length];
        div.innerHTML = `
            <h4>${title}</h4>
            <div id="content${y}${x}" data-row="${this.tags[y]}" data-index="${x % items.length}" class="p-card p-component">
            <div class="p-card-body">
            <div class="p-card-subtitle">
            ${item?.duration}
            </div>
            <div class="p-card-title">${item?.title}</div>
            <div class="p-card-content">
            <p class="m-0 truncate-text">${item?.description}</p>
            </div>
            </div>
            </div>`
        row.appendChild(div);
        document.querySelector(`#${this.containerId}`)?.appendChild(row);
      }
      this.contentRep.push(gsap.utils.toArray(row.querySelectorAll(`.${this.divClass}`)));
    }

    this.rows = document.querySelectorAll(`.${this.rowClass}`),
      this.contentMidIndex = Math.floor(this.contentNum / 2),
      this.rowMidIndex = Math.floor(this.rowNum / 2);
  }

  addTitle(title: string) {
    let titleRow = document.createElement("div");
    titleRow.className = this.rowClass;
    let titleDiv = document.createElement("div");
    titleDiv.className = this.divClass;
    titleDiv.innerHTML = `<h5>${title}</h5>`
    titleRow.appendChild(titleDiv);
    document.querySelector(`#${this.containerId}`)?.appendChild(titleRow);
  }

  createMask() {
    let mask = document.createElement("div");
    mask.className = "mask";
    let container: any = document.querySelector(`#${this.containerId}`)?.parentElement;
    container.appendChild(mask);

    gsap.set(mask, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      zIndex: 9999,
    });
  }

  createDraggable() {
    let options: any = {
      trigger: ".mask",
      dragResistance: 0.4,
      resistance: 400,
      onDrag: () => {
        this.updateCenterElem();
      }
    }

    if (this.useInertia) {
      options.inertia = true;
      options.onThrowUpdate = () => {
        this.updateCenterElem();
      }
      if (this.useCenterGrid) {
        options.onThrowComplete = () => { this.centerGrid(); }
      }
    } else if (this.useCenterGrid) { // No inertia
      options.onDragEnd = () => { this.centerGrid(); }
    }

    return Draggable.create(`#${this.containerId}`, options);
  }

  updateCenterElem() {


    let elems = document.elementsFromPoint(this.winMidX, this.winMidY);
    elems.forEach(elem => {

      if (elem.matches(`.${this.divClass}`) && !this.lastCenteredElem.isSameNode(elem)) {
        this.lastCenteredElem = elem;
        this.checkPositions(this.lastCenteredElem);
      }
    });
  }

  checkPositions(elem: any) {
    // Find the location in our array of the element
    let rowIndex = -1,
      imgIndex = -1;

    this.contentRep.forEach((row: any, i: any) => {
      row.forEach((img: any, j: any) => {
        if (elem.isSameNode(img)) {
          rowIndex = i;
          imgIndex = j;
        }
      });
    });

    // Element not found, return
    if (rowIndex === -1)
      return;

    // Reposition elements as necessary so that our element is in the center
    // Reposition the rows as necessary
    if (rowIndex < this.rowMidIndex) {

      for (let i = rowIndex; i < this.rowMidIndex; i++) {
        // Update the row's actual position
        let rowY: any = gsap.getProperty(this.rowArray[0], "y");
        if (this.rowArray.length % 2 === 1) { // Odd number of rows means we have to handle offset
          let row = this.rowArray[this.rowArray.length - 1];
          if (row.dataset.offset === "true") {
            gsap.set(row, { y: rowY - this.gutter - this.boxHeight, x: "+=" + this.boxWidth / 2 });
            row.dataset.offset = "false";
          } else {
            gsap.set(row, { y: rowY - this.gutter - this.boxHeight, x: "-=" + this.boxWidth / 2 });
            row.dataset.offset = "true";
          }
        } else { // Equal number of rows; don't have to handle offset
          gsap.set(this.rowArray[this.rowArray.length - 1], { y: rowY - this.gutter - this.boxHeight });
        }

        // Update our representations
        this.moveArrayIndex(this.contentRep, this.contentRep.length - 1, 0);
        this.moveArrayIndex(this.rowArray, this.rowArray.length - 1, 0);
      }
    } else if (rowIndex > this.rowMidIndex) {
      for (let i = this.rowMidIndex; i < rowIndex; i++) {
        // Update the row's actual position
        let rowY = gsap.getProperty(this.rowArray[this.rowArray.length - 1], "y");

        if (this.rowArray.length % 2 === 1) { // Odd number of rows means we have to handle offset
          let row = this.rowArray[0];
          if (row.dataset.offset === "true") {
            gsap.set(row, { y: rowY + this.gutter + this.boxHeight, x: "-=" + this.boxWidth / 2 });
            row.dataset.offset = "false";
          } else {
            gsap.set(row, { y: rowY + this.gutter + this.boxHeight, x: "+=" + this.boxWidth / 2 });
            row.dataset.offset = "true";
          }
        } else { // Equal number of rows; don't have to handle offset
          gsap.set(this.rowArray[0], { y: rowY + this.gutter + this.boxHeight });
        }

        // Update our representations
        this.moveArrayIndex(this.contentRep, 0, this.contentRep.length - 1);
        this.moveArrayIndex(this.rowArray, 0, this.rowArray.length - 1);
      }
    }


    // Reposition the images as necessary
    if (imgIndex < this.contentMidIndex) {
      for (let rowNum = 0; rowNum < this.rows.length; rowNum++) { // Do it for every row
        let row = this.contentRep[rowNum];

        for (let i = imgIndex; i < this.contentMidIndex; i++) {
          // Update the images's actual position
          let imgX: any = gsap.getProperty(row[0], "x");

          gsap.set(row[row.length - 1], { x: imgX - this.gutter - this.boxWidth });

          // Update our representation
          this.moveArrayIndex(row, row.length - 1, 0);
        }
      }
    } else if (imgIndex > this.contentMidIndex) {
      for (let rowNum = 0; rowNum < this.rows.length; rowNum++) { // Do it for every row
        let row = this.contentRep[rowNum];

        for (let i = this.contentMidIndex; i < imgIndex; i++) {
          // Update the images's actual position
          let imgX = gsap.getProperty(row[this.contentNum - 1], "x");

          gsap.set(row[0], { x: imgX + this.gutter + this.boxWidth });

          // Update our representation
          this.moveArrayIndex(row, 0, row.length - 1);
        }
      }
    }
  }

  centerGrid() {
    let bcr = this.lastCenteredElem.getBoundingClientRect();
    let midX = bcr.x + bcr.width / 2;
    let midY = bcr.y + bcr.height / 2;

    let x = this.winMidX - midX;
    let y = this.winMidY - midY;

    gsap.to(`#${this.containerId}`, {
      ease: "sine.inOut",
      duration: 0.7,
      x: "+=" + x,
      y: "+=" + y
    });
  }

  moveArrayIndex(array: any, oldIndex: any, newIndex: any) {
    if (newIndex >= array.length) {
      newIndex = array.length - 1;
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
  }

  setStyles() {
    gsap.set("body", {
      margin: 0,
      overflow: "hidden"
    });

    gsap.set(`.${this.divClass}`, {
      position: "absolute",
      backgroundSize: "cover",
      backgroundPosition: "center",
      top: 0,
      left: 0
    });

    gsap.set(`.${this.rowClass}`, {});
  }

  resize() {
    this.winMidX = innerWidth / 2;
    this.winMidY = innerHeight / 2;
    this.boxWidth = innerWidth * 0.35;
    if (screen.width <= 425) {
      this.boxWidth = innerWidth
    }
    this.boxHeight = innerHeight * 0.35;

    this.gutter = innerWidth * 0.05;
    this.horizSpacing = this.boxWidth + this.gutter;
    this.vertSpacing = this.boxHeight + this.gutter;
    this.horizOffset = -(this.contentMidIndex * this.horizSpacing + this.boxWidth / 2) + this.winMidX;
    this.vertOffset = -(this.rowMidIndex * this.vertSpacing + this.boxHeight / 2) + this.winMidY;

    // Reset our container and rows
    gsap.set(`#${this.containerId}`, { x: 0, y: 0 });

    this.rows.forEach((row: any, i: any) => {
      const dataOffset: any = function () {
        if (i % 2 === 0) return false;
        else return true;
      }
      gsap.set(row, {
        attr: {
          "data-offset": dataOffset
        },
        x: () => {
          if (i % 2 === 0)
            return this.horizOffset;
          else
            return this.horizOffset - this.boxWidth / 2;
        },
        y: () => {
          return i * this.vertSpacing + this.vertOffset;
        },
      });

      gsap.set(row.querySelectorAll(`.${this.divClass}`), {
        width: this.boxWidth,
        height: this.boxHeight,
        x: (index) => {
          return index * this.horizSpacing;
        }
      });

      // Update our representation of the rows
      this.rowArray[i] = row;
    });
  }
}
