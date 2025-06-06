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

export const reserveProduct = async ({ idProducto, idUsuarioReserva, metodoPago, metodoEntrega }) => {
  if (!idProducto || !idUsuarioReserva) {
    return { success: false, message: "Faltan parámetros para reservar el producto" };
  }

  const { data: product, error: productError } = await supabase
    .from("Productos")
    .select("*, Juegos(*)")
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
        product_id: product.id,
        product_name: product?.Juegos?.name || null,
        payment_method: metodoPago,
        delivery_method: metodoEntrega

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
          product_id: product.id,
          product_name: product?.Juegos?.name || null,
          payment_method: metodoPago,
          delivery_method: metodoEntrega,
          seller_cbu: sellerData.cbu
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

export const confirmSale = async ({idProducto}) => {
  const {data, error} = await supabase.from("Productos").delete().eq("id", idProducto);
  if (error) {
    console.log(error);
  } else {
    const {data, error} = await supabase.from("Comprobantes").delete().eq('product_id', idProducto);
    if (error) {
      console.log(error);
    }
  }
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

export const onSearch= async ({ name, category, duration }) => {
  console.log("el juego es")
  console.log(name);
  console.log("la categoria es", category);
  console.log("la duracion es", duration);
  //CREO QUE ESTA QUERY ESTA MEDIA AL DOPE
    let query = supabase  
      .from("Productos").select("Juegos(*), *")
      .eq('Juegos.name', name)
      .eq('Juegos.category', category);
    //if (duration) {             
    //  const [min, max] = duration.split("-");
    //  if (max) {
    //    // Rango: 0-15, 15-45, etc.
    //    query = query
    //      .gt("Juegos.duration", parseInt(min))
    //      .lt("Juegos.duration", parseInt(max));
    //  } else if (min.endsWith("+")) {
    //    // Rango abierto: 45+
    //    const minValue = parseInt(min);
    //    query = query.gte("Juegos.duration", minValue);
    //  }
    //}
  const {data, error} = await query;

  if (error) {
    console.log(error)
    return [];
  }
  console.log(data);

  return data;
}


// Verifica si el usuario ya tiene un CBU registrado
export const checkUserHasCbu = async (username) => {
  try {
    const { data, error } = await supabase
      .from("perfiles")
      .select("cbu")
      .eq("username", username)
      .single();
    
    if (error) {
      console.error("Error checking CBU:", error);
      return false;
    }
    
    // Si data.cbu existe y no está vacío, el usuario tiene CBU
    return !!data.cbu;
  } catch (error) {
    console.error("Exception checking CBU:", error);
    return false;
  }
};

// Guarda el CBU del usuario
export const saveCbu = async (username, cbu) => {
  try {
    const { error } = await supabase
      .from("perfiles")
      .update({ cbu: cbu })
      .eq("username", username);
    
    if (error) {
      console.error("Error saving CBU:", error);
      throw new Error(error.message);
    }
    
    return true;
  } catch (error) {
    console.error("Exception saving CBU:", error);
    throw error;
  }
};

export const uploadFile = async ({file}) => {

  const fileName = `payment_${Date.now()}.jpg`; 
  const filePath = `${fileName}`;

  const { data, error } = await supabase
    .storage
    .from('payments') 
    .upload(filePath, file);

  if (error) {
    console.log(error);
    return null;
  }


  const { data: publicUrlData } = supabase
    .storage
    .from('payments')
    .getPublicUrl(filePath);


  return publicUrlData.publicUrl;
};

export const savePaymentUrl = async ({receiptId, publicUrl}) => {
  const { data, error } = await supabase
    .from('Comprobantes')
    .update({ payment_url: publicUrl })
    .eq('id', receiptId);

  if (error) {
    console.error('Error actualizando el comprobante:', error);
    return null;
  }

  return data;
};

//En esta query se obtienen las cantidad de jugadores del supabase
export const cantidadJugadoresUnicas = async () => {
  const {data, error } = await supabase
    .from('Juegos')
    .select('players', { count: 'exact'})
    .order('players', {ascending: true})
  
    if (error) {
      console.error('Error obteniendo cantidad de jugadores', error);
      return [];
    }

    const cantidadJugadores = [...new Set(data.map(juego => juego.players))];  // Los 3 puntos "..." convierten el Set de nuevo en un array
    return cantidadJugadores;
};

// Función para actualizar un producto
export const updateProduct = async (productData) => {
  try {
    const { data, error } = await supabase
      .from('Productos')
      .update({
        location: productData.location,
        price: productData.price,
        description: productData.description
      })
      .eq('id', productData.id)
      .select();

    if (error) {
      console.error('Error updating product:', error);
      throw error;
    }

    return data[0];
  } catch (error) {
    console.error('Error in updateProduct:', error);
    throw error;
  }
};