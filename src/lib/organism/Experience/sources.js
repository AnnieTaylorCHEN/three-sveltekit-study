export default [
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'textures/environmentMaps/1/px.jpg',
            'textures/environmentMaps/1/nx.jpg',
            'textures/environmentMaps/1/py.jpg',
            'textures/environmentMaps/1/ny.jpg',
            'textures/environmentMaps/1/pz.jpg',
            'textures/environmentMaps/1/nz.jpg'
        ]
    },
    {
        name: 'grassColorTexture',
        type: 'texture',
        path: 'textures/dirt/color.jpg'
    },
    {
        name: 'grassNormalTexture',
        type: 'texture',
        path: 'textures/dirt/normal.jpg'
    },
    {
        name: 'foxModel',
        type: 'gltfModel',
        path: 'models/Fox/glTF/Fox.gltf'
    }, {
        name:'brainStemModel',
        type: 'gltfModel',
        path: 'models/BrainStem/glTF-Draco/BrainStem.gltf'
    }
]