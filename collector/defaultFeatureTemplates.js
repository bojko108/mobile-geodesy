const defaultFeatureTemplates = [
  {
    name: 'object',
    relations: [],
    alias: 'Обект',
    attributes: [
      {
        name: 'name',
        alias: 'Име',
        defaultValue: '',
        required: true,
        validators: [],

        type: 'text',
        maxLength: 200,
      },
      {
        name: 'description',
        alias: 'Описание',
        defaultValue: '',
        required: false,
        validators: [],

        type: 'text',
        maxLength: 400,
      },
      {
        name: 'geometry',
        alias: 'Позиция',
        defaultValue: null,
        required: true,
        validators: [
          // {
          //   name: 'precision',
          //   validValue: 100000
          // }
        ],
        errorText: 'Waiting for accuracy of 10 meters',

        type: 'location',
        accuracy: 5,
        timeInteval: 10000,
        distanceInterval: 0,
      },
    ],
    autocad: {
      layerName: 'mg-object',
    },
    map: {
      color: '#f00000',
      label: null,
      marker: 'hexagon',
      anchor: { x: 0.5, y: 0.5 },
    },
  },
  {
    name: 'pylon',
    relations: [],
    alias: 'Стълб',
    attributes: [
      {
        name: 'kind',
        alias: 'Вид',
        defaultValue: 'Носещ',
        required: true,
        validators: [],

        type: 'dropdown',
        domain: 'D_PYLON_KIND',
      },
      {
        name: 'baseType',
        alias: 'Тип на основата',
        defaultValue: 'бетон',
        required: true,
        validators: [],

        type: 'dropdown',
        domain: 'D_BASE_TYPE',
      },
      {
        name: 'description',
        alias: 'Забележка',
        defaultValue: '',
        required: false,
        validators: [],

        type: 'text',
        maxLength: 400,
      },
      {
        name: 'geometry',
        alias: 'Позиция',
        defaultValue: null,
        required: true,
        validators: [
          {
            name: 'precision',
            validValue: 10,
          },
        ],
        errorText: 'Waiting for accuracy of 10 meters',

        type: 'location',
        accuracy: 5,
        timeInteval: 10000,
        distanceInterval: 0,
      },
      // {
      //   name: 'MAJ_CISLO',
      //   alias: 'Номер на актив',
      //   defaultValue: '',
      //   required: false,
      //   validators: [
      //     {
      //       name: 'matches',
      //       validValue: '^[A-ZА-Я]{2}-[A-ZА-Я]{2}-\\d{4}$'
      //     }
      //   ],
      //   errorText: 'SAP code is not in valid format!',

      //   type: 'text',
      //   delimiter: '-',
      //   mask: '@@-@@-####'
      // }
    ],
    autocad: {
      layerName: 'mg-pylons',
      blockName: '1',
      blockAttributes: ['kind', 'baseType'],
    },
    map: {
      color: '#85144b',
      label: null,
      marker: 'floor-lamp',
      anchor: { x: 0.5, y: 1 },
    },
  },
  {
    name: 'manhole',
    relations: [],
    alias: 'Шахта',
    attributes: [
      {
        name: 'kind',
        alias: 'Вид',
        defaultValue: 'Единична',
        required: true,
        validators: [],

        type: 'dropdown',
        domain: 'D_MANHOLE_KIND',
      },
      {
        name: 'description',
        alias: 'Забележка',
        defaultValue: '',
        required: false,
        validators: [],

        type: 'text',
        maxLength: 400,
      },
      {
        name: 'geometry',
        alias: 'Позиция',
        defaultValue: null,
        required: true,
        validators: [
          {
            name: 'precision',
            validValue: 10,
          },
        ],
        errorText: 'Waiting for accuracy of 10 meters',

        type: 'location',
        accuracy: 5,
        timeInteval: 10000,
        distanceInterval: 0,
      },
    ],
    autocad: {
      layerName: 'mg-manholes',
      blockName: 'sever',
      blockAttributes: [],
    },
    map: {
      color: '#ff851b',
      label: null,
      marker: 'alpha-w-box',
      anchor: { x: 0.5, y: 0.5 },
    },
  },
];

const defaultDomains = {
  D_PYLON_KIND: [
    { label: 'Ъглов' },
    { label: 'Портален в уредба' },
    { label: 'Двоен портален' },
    { label: 'Портален' },
    { label: 'Носещ' },
    { label: 'Подпорен' },
    { label: 'Краен' },
    { label: 'Разклонителен' },
    { label: 'Опъвателен' },
    { label: 'Троен портален' },
    { label: 'Помощен' },
    { label: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ' },
    { label: 'НЕ Е ВЪВЕДЕНО' },
  ],
  D_MANHOLE_KIND: [
    { label: 'Единична' },
    { label: 'Двойна' },
    { label: 'Тройна' },
    { label: 'Друга' },
    { label: 'Четворна' },
    { label: 'Ревизионен отвор-колектор' },
    { label: 'Проходим ревизионен отвор-колектор' },
    { label: 'Чужда' },
    { label: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ' },
    { label: 'НЕ Е ВЪВЕДЕНО' },
  ],
  D_BASE_TYPE: [{ label: 'бетон' }, { label: 'монолит' }, { label: 'блокова' }, { label: 'НЕ Е ВЪВЕДЕНО' }, { label: 'НЕ МОЖЕ ДА СЕ ОПРЕДЕЛИ' }],
};

export { defaultFeatureTemplates, defaultDomains };
