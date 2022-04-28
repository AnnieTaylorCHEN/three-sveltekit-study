import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import BrainStem from './BrainStem.js'

export default class World
{
    constructor(_experience)
    {
        this.scene = _experience.scene
        this.resources = _experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.fox = new Fox()
            this.brainStem = new BrainStem()
            this.environment = new Environment()
        })
    }

    update()
    {
        if(this.fox)
            this.fox.update()
        if (this.brainStem)
            this.brainStem.update()
    }
}