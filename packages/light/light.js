// In this file we use some For In loops, becaue babel compiles
// for-of loops to much more complicated code.
//
// New Discovery: The folllowing compiles nicely. Consider
// switching to this syntax:
//
// Object.keys(this.catalog).forEach(() => {  });
//
// In the mean time disable for in loop errors in eslint.

/* eslint no-restricted-syntax: ["off", "ForInStatement"] */

import { Coord } from 'meteor/coord';

export class LightCatalog {
  // all inputs are an integer number of tiles
  constructor(map) {
    this.map     = map;
    this.catalog = {};
  }

  forEach(func) {
    Object.keys(this.catalog).forEach((cx) => {
      const cxInt = parseInt(cx);
      const cxObj = this.catalog(cx);
      Object.keys(cxObj).forEach((cy) => {
        const cyInt = parseInt(cy);
        func(cxObj[cy], cxInt, cyInt);
      });
    });
  }

  // According to stackoverflow, delete during iteration is ok:
  // http://stackoverflow.com/questions/3463048/is-it-safe-to-delete-an-object-property-while-iterating-over-them
  clean() {
    for (const cx in this.catalog) {
      if (this.catalog.hasOwnProperty(cx)) {
        const cxObj = this.catalog[cx];
        for (const cy in cxObj) {
          if (cxObj.hasOwnProperty(cy)) {
            if (Object.keys(cxObj[cy]).length === 0) {

              delete cxObj[cy];
            }
          }
        }
        if (Object.keys(this.catalog[cx]).length === 0) {
          delete this.catalog[cx];
        }
      }
    }
  }

  // maxRadius is an integer number of tiles
  // ensure that all the chunks in the range
  ensure(ctxy, maxRadius) {

    if (this.map.incomplete)
      throw new Error('Cannot ensure without complete map');

    // Figure out which chunks we need to create
    const widthInTiles = maxRadius * 2 + 1;
    const cursor = new Coord(ctxy);

    cursor.move({ tx: - maxRadius, ty: - maxRadius });
    cursor.resolveMap(this.map);
    const minCx = cursor.cx;
    const minCy = cursor.cy;

    cursor.move({ tx: widthInTiles, ty: widthInTiles });
    cursor.resolve(this.map);
    const maxCx = cursor.cx;
    const maxCy = cursor.cy;

    // create any missing arrays
    for (let cx = minCx; cx <= maxCx; cx++) {
      if (!this.catalog.hasOwnProperty(cx)) {
        this.catalog[cx] = {};
      }
      for (let cy = minCy; cy <= maxCy; cy++) {
        if (!this.catalog[cx].hasOwnProperty(cy)) {
          this.catalog[cx][cy] = {};
        }
      }
    }
  }
}

export class LightMap {
  constructor(map, initialChunkCatalog) {
    if (!map)
      throw new Error('Cannot create LightMap without map');

    this.map = map;
    this.chunkCatalog = initialChunkCatalog || {};
  }
}