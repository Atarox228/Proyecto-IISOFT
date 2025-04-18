import supabase from "../supabase-client.js";

export const getProductById = async (id) => {
  const {data, error} = await supabase.from("Products").select("*").eq("id", id);
  if (error) {
    console.error("El producto no existe", error);
    return null;
  }
  return data[0];
};

export const getNombresDeProductos = async () => {
  const {data, error} = await supabase.from("Products").select("name");
  return data;
}