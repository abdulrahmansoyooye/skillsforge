import { app } from "./app.js";
import { prisma } from "./config/prisma.js";
import "dotenv/config"

const port = Number(process.env.PORT ?? 4000);
async function start() {
   const {hostname,port:dbPort,pathname} = new URL(process.env.DATABASE_URL!)
try {
    const tO = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    console.log(`[db] connected to ${hostname}:${dbPort}${pathname} in ${Date.now() - tO} ms`)

} catch (error) {
    console.error(`[db] connection failed to ${hostname}:${dbPort}`)
}
  const server = app.listen(port,()=>console.log(`[http] listening on ${port}`))
    const shutdown = async (signal:string)=>{
        console.log(`[app] $${signal} recived, shutting down`)
        server.close()
        await prisma.$disconnect();
        process.exit(0);
    }
    process.on('SIGINT',()=>shutdown('SIGINT'))
    process.on('SIGTERM',()=>shutdown('SIGTERM'))
}

start()