import supabase from "../supabase-client.js";

export const getProductById = async (id) => {
  const {data, error} = await supabase
      .from("Products").select("*, Juegos(*)").eq('id', id);
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
      .from('Products')
      .select('*, Juegos(*)');
  if (error) {
    console.log(error);
  }
  return data;
}
