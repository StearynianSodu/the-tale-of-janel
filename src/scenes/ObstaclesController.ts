export default class ObstaclesController{
    private obstacles = new Map<string, MatterJS.BodyType>()

    add(name: string, body: MatterJS.BodyType){
        const key = `${name}-${body.id}`

        if(this.obstacles.has(key)){
            throw new Error('Key already exists')
        }
        this.obstacles.set(key,body)
    }
}