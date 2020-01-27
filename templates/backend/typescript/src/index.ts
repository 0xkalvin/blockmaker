import express, { Response, Request, Application} from 'express'
import cors from 'cors'



const app: Application = express()


app.use(cors())

app.get('/', (req: Request, res: Response) => {
    res.send({ message: "hello world"})
})



app.listen(3000, () => console.log(`Server listening on port 3000`))