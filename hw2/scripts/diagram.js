class ZoomeableImage {
  constructor() {
    // initialize properties
    this.image = document.getElementById("diagram-zoom");
    this.curZoom = 1.0;
    this.curOffsetX = 0.0;
    this.curOffsetY = 0.0;
    this.isPanning = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
  }

  onZoom(amount) {
    this.curZoom += amount;
    this.image.style.setProperty("transform", `scale(${this.curZoom})`);
  }

  onPan(offsetX, offsetY) {
    this.curOffsetX += offsetX;
    this.curOffsetY += offsetY;
    this.image.style.setProperty("left", `${this.curOffsetX}px`)
    this.image.style.setProperty("top", `${this.curOffsetY}px`)
  }

  setEventListeners() {
    // handle panning
    this.image.addEventListener("pointerdown", (evt) => {
      this.isPanning = true;
      this.lastMouseX = evt.clientX;
      this.lastMouseY = evt.clientY;
      evt.preventDefault();
    });
    this.image.addEventListener("pointerup", (evt) => {
      this.isPanning = false;
    });
    this.image.addEventListener("pointerleave", (evt) => {
      this.isPanning = false;
    });
    this.image.addEventListener("pointermove", (evt) => {
      if (this.isPanning) {
        this.onPan(evt.clientX - this.lastMouseX, evt.clientY - this.lastMouseY);
        this.lastMouseX = evt.clientX;
        this.lastMouseY = evt.clientY;
      }
    });
    this.image.addEventListener("scroll", evt => evt.preventDefault());

    // handle zooming
    document
      .getElementById("diagram-zoom-in")
      .addEventListener("click", () => this.onZoom(0.04));
    document
      .getElementById("diagram-zoom-out")
      .addEventListener("click", () => this.onZoom(-0.04));
    const actualImage = document.getElementById("diagram-bg");
    actualImage.addEventListener("load", () => {
      const initZoom = this.image.clientWidth / actualImage.naturalWidth;
      this.curZoom = initZoom;
      this.onZoom(0.0);
    });
  }
}

const POI_DATA = [
  {
    location: { x: 1720, y: 3147 },
    name: "Chongqing University",
    content: `
      This university is full of history, having been founded in 1929
      and continuing to educate students even through the second world war. 
      However, it also plays an inmportant role in Chinese education today, as
      part of the "211" and "985" projects.
      The rail station is convenient to academic buildings and dorms`,
    picture: "./images/map-university.jpg"
  },
  {
    location: { x: 2940, y: 1420 },
    name: "International Expo Center",
    content: `
The Internation Expo Center is home to a variety of exciting events.
The local transit hub provices convenient access for attendees.
    `,
    picture: "./images/map-expo-center.jpg"
  },
  {
    location: { x: 3067, y: 3440 },
    name: "Liziba Station",
    content: `
Liziba Station is a famous platform on Line 2 of the network. It is built
into the 6th story of a 20 story residential building. The station was built
like this to work with mountainous terrain in the area, but residents have come
to appreciate the convenience of a train station literally right outside their
doors (high-tech soundproofing helps with the noise).
    `,
    picture: "./images/libiza-station.png"
  },
  {
    location: { x: 3914, y: 3687 },
    name: "Xiaoshizi Station",
    content: `
      Xiaoshizi station is an important interchange between lines 1 and 6.
      It was constructed in 2011`,
    picture: "./images/map-xiaoshizi.jpg"
  },
  {
    location: { x: 4079, y: 3488 },
    name: "Raffles City",
    content: `
        Raffles City Chonqing is a newly constructed skyscraper on the shores
        of the city's three rivers. The building features the longest and highest
        sky bridge in the world. The design was inspired by the sillhouette of
        the traditional Chinese sailing vessels that would have once delivered
        goods to the city.
        It is serviced by Chaotianmen Station.
      `,
    picture: "./images/map-raffles.webp"
  },
  {
    location: { x: 2461, y: 5900 },
    name: "Yudong Station",
    content: `
      Yudong station serves line 3, and provides access to the Banan district.
      It features a 30 foot, brightly colored, spiral slide to allow younger passengers to exit
      the second level.
      `,
    picture: "./images/map-yudong.jpg"
  },
  {
    location: { x: 1532, y: 960 },
    name: "Southwest University",
    content: `
      Southwest University is a small university by Chongqing's standards,
      with only 60,000 students. Departments include The College of Biotechnology,
      The College of Education, and the School of Marxism Studies.
      `,
    picture: "./images/map-southwest.jpg"
  },
  {
    location: { x: 4848, y: 3911 },
    name: "Caojiawan Station",
    content: `
      Caojiawan station sits near the end of line 6.
      When the station orginally opened, the area was a large, empty
      field, with no nearby buildings. 
      This odd location made it famous as an example of administrative folly.
      However, the area has developed rapidly in the last decade, and the station
      has many uses. It is now
      see as an example of administrative forsight.`,
    picture: "./images/map-caojiawan.jpg"
  },
];

function makePOIElements() {
  const diagram = document.getElementById("diagram-zoom");
  POI_DATA.forEach((data) => {
    const elem = document.createElement("div");
    elem.setAttribute("id", `diagram-poi-${data.name}`);
    // setting the title changes the onhover tooltip, per
    // https://stackoverflow.com/questions/2238239/tooltips-for-button-elements
    elem.setAttribute("title", data.name);
    elem.classList.add("diagram-poi");
    elem.style.setProperty("left", `${data.location.x}px`);
    elem.style.setProperty("top", `${data.location.y}px`);
    elem.addEventListener("click", evt => {
      makePOIInfo(data);
      evt.preventDefault();
    });
    diagram.appendChild(elem);
  });

  document
    .getElementById("diagram-poi-info-close")
    .addEventListener("click", evt => { removePOIInfo(); evt.preventDefault(); });
}

function makePOIInfo(infoItem) {
  const dialog = document.getElementById("diagram-poi-info");
  dialog.classList.remove("hideme");
  dialog.querySelector("#diagram-poi-title").innerHTML = infoItem.name;
  dialog.querySelector("#diagram-poi-content").innerHTML = infoItem.content;
  dialog.querySelector("#diagram-poi-image").setAttribute("src", infoItem.picture);
  dialog.querySelector("#diagram-poi-image").setAttribute("alt", `Picture of ${infoItem.name}`);
}

function removePOIInfo() {
  const dialog = document.getElementById("diagram-poi-info");
  dialog.classList.add("hideme");
  // Clear out the previous image, so that it won't be shown
  // while we are waiting for the next one to load.
  document.getElementById("diagram-poi-image").setAttribute("src", "");
}

// initial setup
document.addEventListener("DOMContentLoaded", () => {
  // setup zoom and pan
  const zoomer = new ZoomeableImage();
  zoomer.setEventListeners();

  // place the Point of Interest elements
  makePOIElements();
});
