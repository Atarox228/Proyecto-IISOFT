import supabase from "../supabase-client.js";

export const getProductById = async (id) => {
  const {data, error} = await supabase
      .from("Productos").select("*, Juegos(*)").eq('id', id);
  if (error) {
    console.log(error);
  }
  return data[0];
}

export const getNameOfGames = async () => {
  const {data, error} = await supabase.from("Juegos").select("name");
  if (error) {
    console.log(error);
  }
  return data;
}

export const fetchAllProducts = async () => {
  const {data, error} = await supabase
      .from('Productos')
      .select('*, Juegos(*)');
  if (error) {
    console.log(error);
  }
  return data;
}

export const createProduct = async ({nombre, ubicacion, precio, descripcion}) => {
  const {idDeJuego, error} = await supabase
      .from("Juegos")
      .select("id")
      .eq('name', nombre);
  if (error) {
    console.log(error);
  }

  const { data, errorInsert } = await supabase
      .from("Productos")
      .insert([
        {
          idJuego: idDeJuego,
          location: ubicacion,
          price: precio,
          description: descripcion
        }
      ]);
  if (errorInsert) {
    console.error("Error al querer insertar producto", errorInsert);
  }
  console.log(data);

}