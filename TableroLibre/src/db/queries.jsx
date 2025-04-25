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

  const { data: product, error: productError } = await supabase
    .from("Productos")
    .select("*")
    .eq("id", idProducto)
    .single();

  if (productError || !product) {
    return { success: false, message: "Producto no encontrado" };
  }

  if (product.id_buyer === null) {
    const { error: updateError } = await supabase
      .from("Productos")
      .update({ id_buyer: idUsuarioReserva })
      .eq("id", idProducto);

    if (updateError) {
      return { success: false, message: "Error al reservar el producto" };
    } else {
      const { data: buyerData, error: buyerError } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", idUsuarioReserva)
        .single();

      const { data: sellerData, error: sellerError } = await supabase
        .from("perfiles")
        .select("*")
        .eq("username", product.seller_username)
        .single();

      if (buyerError || sellerError || !buyerData || !sellerData) {
        return { success: false, message: "No se pudo obtener la información del vendedor o comprador" };
      }
      console.log("Insertando comprobante con:", {
        seller: sellerData.username,
        seller_email: sellerData.email,
        address: product.location,
        buyer: buyerData.username,
        buyer_email: buyerData.email,
        price: product.price,
        product_id: product.id
      });
      const { error: receiptError } = await supabase
        .from("Comprobantes")
        .insert([{
          seller: sellerData.username,
          seller_email: sellerData.email,
          address: product.location,
          buyer: buyerData.username,
          buyer_email: buyerData.email,
          price: product.price,
          product_id: product.id
        }]);

      if (receiptError) {
        return { success: false, message: "Error al generar el comprobante" };
      }

      return { success: true, message: "" };
    }
  } else {
    return { success: false, message: "El producto ya fue reservado" };
  }
};

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
    const {data, error} = await supabase.from("Comprobantes").delete().eq('product_id', id_product);
    if (error) {
      console.log(error);
    }
  }
}


export const getReceiptFrom = async ({ productId }) => {
  const { data, error } = await supabase
    .from("Comprobantes")
    .select("*")
    .eq("product_id", productId)
    .single();
  if (error) {
    console.error("Error obteniendo el comprobante:", error);
    return null;
  }

  return data;
};