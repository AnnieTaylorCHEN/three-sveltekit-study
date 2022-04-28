import * as THREE from 'three'

export default class BrainStem
{
    constructor(_experience)
    {
        this.scene = _experience.scene
        this.resources = _experience.resources
        this.time = _experience.time
        this.debug = _experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('Brain Stem')
        }

        // Resource
        this.resource = this.resources.items.brainStemModel

        this.setModel()
        this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource.scene
        this.model.scale.set(1.5,1.5,1.5)
        this.model.position.x = 1
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}  
        this.animation.actions.dance = this.animation.mixer.clipAction(this.resource.animations[0])


        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                dance: () => { this.animation.actions.dance.play()},
                stop: () => { this.animation.actions.dance.stop()},
            }
            this.debugFolder.add(debugObject, 'dance')
            this.debugFolder.add(debugObject, 'stop')
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}