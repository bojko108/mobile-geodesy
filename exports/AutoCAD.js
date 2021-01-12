import Drawing from 'dxf-writer';
import { getConfigFor, getAutoCADLayers } from '../collector/config';
import { escapeCyrillicText } from '../calculations/helpers';

export const createDXFFile = features => {
  const layers = getAutoCADLayers();

  const drawing = new Drawing();
  drawing.setUnits('Meters');
  Object.keys(layers).forEach(layer => {
    drawing.addLayer(layers[layer], Drawing.ACI.GREEN, 'CONTINUOUS');
  });

  features.forEach(({ featureType, properties, geometry }) => {
    const { latitude, longitude } = geometry;
    const config = getConfigFor(featureType);
    if (config) {
      drawing.setActiveLayer(layers[featureType]).drawPoint(longitude, latitude);
    }
  });

  return drawing.toDxfString();
};

export const createScriptFile = features => {
  const layers = getAutoCADLayers();
  let content = [];

  features.forEach(({ featureType, properties, geometry }) => {
    // create a new layer and make it current
    content.push(writeLayer(layers[featureType]));

    const { latitude, longitude } = geometry;
    const config = getConfigFor(featureType);
    if (config && config.autocad && config.autocad.blockName) {
      const attributes = config.autocad.blockAttributes.map(attribute => escapeCyrillicText(properties[attribute]));
      const text = writeBlock(config.autocad.blockName, longitude, latitude, attributes);
      content.push(text);
    } else {
      content.push(writePoint(longitude, latitude));
    }
  });
  return content.join('\n') + '\n';
};

const writeLayer = name => {
  return `LAYER\nM\n${name}\n`;
};

const writePoint = (x, y) => {
  return `POINT\n${x},${y}\n`;
};

const writeBlock = (name, x, y, attributes) => {
  let text = `-INSERT\n${name}\n${x},${y}\n1\n1\n0`;
  if (attributes && attributes.length > 0) {
    text += '\n';
    text += `${attributes.join('\n')}`;
  }
  return text;
};

/*

- INSERT
<block name>
<X>,<Y>
<ScaleX>
<ScaleY>
<Rotation>
<ATTDEF1>
<ATTDEF2>
<ATTDEF...>
<empty line>

*/
