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
  console.log('fetching')
  const {data, error} = await supabase
      .from('Productos')
      .select('*, Juegos(*)')
      .order('created_at', { ascending: false });
      console.log('fetched')
  if (error) {
    console.log(error);
  }
  return data;
}

export const getIdOfGameByName = async (name) => {
  const {data, error} = await supabase
      .from("Juegos")
      .select("*")
      .eq('name', name);
  if (error) {
    console.log(error);
  }
  return data[0].id;
}

export const reserveProduct = async ({ idProducto, idUsuarioReserva }) => {
  if (!idProducto || !idUsuarioReserva) {
    return { success: false, message: "Faltan parámetros para reservar el producto" };
  }

  const product = await getProductById(idProducto); 

  if (!product) {
    return { success: false, message: "Producto no encontrado" };
  }

  if (product.id_buyer === null) {
    const { data, error } = await supabase
      .from("Productos")
      .update({ id_buyer: idUsuarioReserva })
      .eq('id', idProducto);

    if (error) {
      return { success: false, message: "Error al reservar el producto" };
    } else {
      return { success: true, message: "" };
    }
  } else {
    return { success: false, message: "Error al confirmar la reserva: el producto ya fue reservado" };
  }
};

export const getSellerInformation = async ({userVendedor}) => {
  const {data, error} = await supabase.from('perfiles').select('*').eq('username', userVendedor);
  if (error) {
    console.log(error);
  } 
  return data[0];
}

export const createProduct = async ({ idDeJuego, ubicacion, precio, descripcion, seller_username }) => {
  const { data, errorInsert } = await supabase
    .from("Productos")
    .insert([
      {
        id_juego: idDeJuego,
        description: descripcion,
        price: precio,
        location: ubicacion,
        seller_username // 👈 este campo debe existir en tu tabla
      }
    ]);
  if (errorInsert) {
    console.error("Error al querer insertar producto", errorInsert);
  }
};

export const cancelReserve = async({id_product}) => {
  
  const {data, error} = await supabase.from("Productos").update({id_buyer: null}).eq('id', id_product);
  if (error) {
    console.log(error);
  } else {
    console.log('cancelado');
  }
}
