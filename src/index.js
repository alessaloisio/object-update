/**
 * Remap properties on the object
 * Ex: "info.age" => info: {age: ...}
 * @param {Object} opt Object with properties to remap
 */
const remapKeys = opt => {
  for (let i = 0; i < Object.keys(opt).length; i++) {
    const key = Object.keys(opt)[i];

    if (opt[key] && typeof opt[key] === 'object') {
      remapKeys(opt[key]);
    } else {
      const indexOfKey = key.indexOf('.');
      if (indexOfKey > 0) {
        const optKey = key.substring(0, indexOfKey);

        opt[optKey] = {
          ...opt[optKey],
          [key.substring(indexOfKey + 1)]: opt[key],
        };

        delete opt[key];
        i -= 1;
      }
    }
  }

  return opt;
};

export default class Update {
  constructor(obj) {
    this.obj = obj;

    this.findInitState = {
      depth: 0,
      validation: {
        position: 0,
        status: false,
        findPath: [],
      },
    };
  }

  find(opt) {
    return this.findRecursive(this.obj, remapKeys(opt));
  }

  findRecursive(
    obj,
    conditions,
    results = [],
    opt = { ...this.findInitState }
  ) {
    // Start the properties loop
    Object.keys(obj).map(key => {
      if (!opt.validation.position && conditions[key]) {
        opt.validation.position = opt.depth;
        opt.validation.status = true;
      }

      if (obj[key] && typeof obj[key] === 'object') {
        let tmpConditions = conditions[key]
          ? { ...conditions[key] }
          : { ...conditions };

        this.findRecursive(obj[key], tmpConditions, results, {
          ...opt,
          depth: opt.depth + 1,
        });

        if (opt.depth >= opt.validation.position) {
          if (!Object.keys(tmpConditions).length) {
            delete conditions[key];
          }
        }
      } else if (obj[key] === conditions[key]) {
        if (!opt.validation.position) {
          opt.validation.position = opt.depth;
          opt.validation.status = true;
        }

        delete conditions[key];
      }
      return true;
    });

    // Validation results and clear states
    if (opt.validation.status && opt.depth === opt.validation.position) {
      if (!Object.keys(conditions).length) {
        results.push(obj);
      }

      opt = {
        ...opt,
        validation: {
          ...opt.validation,
          position: 0,
          status: false,
        },
      };
    }

    return results;
  }

  merge() {
    console.log(this);
    // Object.keys(this.obj).map(key => {
    //   if (typeof data[key] !== "undefined") {
    //     if (typeof this.obj[key] === "object") {
    //       this.obj[key] = {
    //         ...this.obj[key],
    //         ...update(this.obj[key], data[key])
    //       };
    //     } else if (this.obj[key] !== data[key]) {
    //       this.obj[key] = data[key];
    //     }
    //   } else if (this.obj[key] && typeof this.obj[key] === "object") {
    //     this.obj[key] = {
    //       ...this.obj[key],
    //       ...update(this.obj[key], data)
    //     };
    //   }
    // });
  }
}

// eslint-disable-next-line no-extend-native
Object.prototype.update = function(find, options) {
  const element = new Update(this);
  console.log(element.find(find));
  // element.find(find).merge(options);
  return element.obj;
};
