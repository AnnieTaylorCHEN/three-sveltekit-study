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
            this.floor = new Floor(_experience)
            this.fox = new Fox(_experience)
            this.brainStem = new BrainStem(_experience)
            this.environment = new Environment(_experience)
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