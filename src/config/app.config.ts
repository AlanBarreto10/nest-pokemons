
export const EnvConfiguration = () => ({
    environment: process.env.NODE_ENV || 'dev',
    mongodb: process.env.MONGO_DB || '',
    port: process.env.PORT || 3002

})

/*
variables de entorno generales:
  -desarrollo
  -produccion
  -testing 
  */