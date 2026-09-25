>[!IMPORTANT]
>This repository is a mirror of work completed as a part of a project in the second year of my degree. It is no longer functional as the API isn't publicly available. But you can [click here to view some screenshots](https://github.com/reubwa/project-velodrome-mirror/blob/main/README.md#gallery)!

# Project Velodrome

![tests passing badge](./test-passing-badge.svg)

## Developers

|Contributors list|
|----|
|Reuben Waring|
|Conor Sweeney Stoppard [@ConorSS](https://github.com/ConorSS)|
|George Grosvenor [@Georgegrosvenor06](https://github.com/Georgegrosvenor06)|
|Amaryllis Richmond [@LunaPixu](https://github.com/LunaPixu)|

(For licensing information, [click here](LICENSE))

## Project goal

Our goal, outlined by our client [VELOCITI](https://www.velociti-solutions.com/) was to build a system for visualising and interacting with [TIPLOC](# 'a point on the railway network (for instance, a station)') data via an integrated API. 

Our project enables users to select a [TIPLOC](# 'a point on the railway network (for instance, a station)') to access the timetables, displaying departure times and journey details in a sidebar whilst also plotting the route on a map for an accurate visual representation.

## How to run locally

To run the project locally from clean install, open terminal and input;

```bash
npm install
```

The development server may then sucessfully start and run;

```bash
npm run dev
```

The server will then be accessible via <http://localhost:3000>.

> [!NOTE]
> The server runs on port 3000 by default. To run the program on a different port, [arguments need to be passed through to vite.](https://vite.dev/guide/cli)
> ```bash
> npm run dev -- --port 4000
> ```


## Features list

|Feature|Description|
|----|----|
|Line rendering| Plots a line between the Tiplocs to represent the journey.|
|[TIPLOC](# 'a point on the railway network (for instance, a station)') Filtering| A filtering system that allows users to filter the map by [TIPLOC](# 'a point on the railway network (for instance, a station)') name.|
|Timetable display| A menu which displays the timetable and journey of a train once selected.|
|Information display| When a [TIPLOC](# 'a point on the railway network (for instance, a station)') is selected, the relevant information such as Station number, will be displayed to the user.|
|Departures display| When the departures button is selected on a [TIPLOC](# 'a point on the railway network (for instance, a station)'), it will display all relevant departures. |
|Live clock| A clock system which displays the live time. |

## Gallery 

![A screenshot that features a TIPLOC and its departure information.](./screenshots/DeparturesBar.png)

|![A screenshot that showcases the TIPLOC filtering menu.](./screenshots/FilterBar.png)|![A screenshot which features the Journey of a selected train.](./screenshots/JourneyBar.png)|![A screenshot which showcases a more in-depth review of a train's journey.](./screenshots/TimeBar.png)|
|---|---|---|

|![A screenshot which showcases the TIPLOC filtered by the previous screenshot. ](./screenshots/Filterred.png)|![A screenshot that features the plotted journey of the train on the map.](./screenshots/JourneyJourney.png)|
|---|---|

## Libraries Used

A web based tool based on [react](https://react.dev/reference/react) and [leaflet](https://leafletjs.com/reference.html) for visualising train data on the UK rail network.

||
|-----|
|[Vite](https://vite.dev/)|
|[ESLint](https://eslint.org/)|
|[React](https://react.dev/)|
|[LeafletJS](https://leafletjs.com/)|
|[React Leaflet](https://react-leaflet.js.org/)|
|[Shadcn](https://ui.shadcn.com/)|
|[Typescript](https://www.typescriptlang.org/)|

## Important miscellaneous links 

||
|----|
[Map identifiers](https://www.openrailwaymap.org)

