const {
  Incoming,
  validateIncoming,
  validateIncomingAll,
} = require('../../models/Products/Incoming')
const { Market } = require('../../models/MarketAndBranch/Market')
const { ProductType } = require('../../models/Products/ProductType')
const { Category } = require('../../models/Products/Category')
const { Unit } = require('../../models/Products/Unit')
const { Product } = require('../../models/Products//Product')

//Incoming registerall
module.exports.registerAll = async (req, res) => {
  try {
    const products = req.body.products
    const market = req.body.market
    const user = req.body.user
    const all = []

    for (const newproduct of products) {
      const { error } = validateIncomingAll(newproduct)
      if (error) {
        return res.status(400).json({
          error: error.message,
        })
      }

      const {
        product,
        unit,
        category,
        supplier,
        pieces,
        unitprice,
        totalprice,
      } = newproduct

      const marke = await Market.findById(market)

      if (!marke) {
        return res.status(400).json({
          message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
        })
      }

      const categor = await Category.findById(category._id)

      if (!categor) {
        return res.status(400).json({
          message: `Diqqat! ${category.code} kodli kategoriya mavjud emas.`,
        })
      }

      const produc = await Product.findById(product._id)

      if (!produc) {
        return res.status(400).json({
          message: `Diqqat! ${product.code} kodli mahsulot avval yaratilmagan.`,
        })
      }

      const unitt = await Unit.findById(unit._id)

      if (!unitt) {
        return res.status(400).json({
          message: `Diqqat! ${unit.name} o'lchov birligi tizimda mavjud emas.`,
        })
      }

      const newProduct = new Incoming({
        product: product._id,
        category: category._id,
        supplier: supplier._id,
        unit: unit._id,
        pieces,
        unitprice,
        totalprice,
        unit: unit._id,
        market,
        user,
      })

      all.push(newProduct)
    }

    all.map(async (product) => {
      await product.save()

      await product.save()

      const produc = await Product.findById(product.product)
      produc.total = produc.total + product.pieces

      await produc.save()
    })

    res.send(all)
  } catch (error) {
    console.log(error)
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Incoming register
module.exports.register = async (req, res) => {
  try {
    const { error } = validateIncoming(req.body)
    if (error) {
      return res.status(400).json({
        error: error.message,
      })
    }
    const {
      totalprice,
      unitprice,
      pieces,
      product,
      category,
      unit,
      supplier,
      user,
      file,
      market,
    } = req.body

    const marke = await Market.findById(market)

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      })
    }

    const newIncoming = new Incoming({
      totalprice,
      unitprice,
      pieces,
      product,
      category,
      unit,
      supplier,
      user,
      file,
      market,
    })
    await newIncoming.save()

    const produc = await Product.findById(product)

    produc.total += parseInt(pieces)
    produc.incomingprice = parseFloat(unitprice)
    await produc.save()

    res.send(newIncoming)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Incoming update
module.exports.update = async (req, res) => {
  try {
    const marke = await Market.findById(req.body.market)

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      })
    }

    const old = await Incoming.findById(req.body._id)

    if (!old) {
      return res.status(400).json({
        message: "Diqqat! Ushbu kirim mahsuloti tizimda ro'yxatga olinmagan.",
      })
    }

    const produc = await Product.findById(req.body.product)

    produc.total -= old.pieces
    produc.total += req.body.pieces
    await produc.save()

    const update = await Incoming.findByIdAndUpdate(req.body._id, {
      ...req.body,
    })

    res.send(update)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Incoming getall
module.exports.get = async (req, res) => {
  try {
    const { market, beginDay, endDay } = req.body
    const marke = await Market.findById(market)

    if (!marke) {
      return res.status(400).json({
        message: "Diqqat! Do'kon ma'lumotlari topilmadi.",
      })
    }

    const incomings = await Incoming.find({
      market,
      createdAt: {
        $gte: beginDay,
        $lt: endDay,
      },
    })
      .select('-isArchive, -updatedAt, -market')
      .populate('product', 'name code')
      .populate('category', 'name code')
      .populate('unit', 'name')
      .populate('supplier', 'name')
      .populate('user', 'firstname lastname')

    res.send(incomings)
  } catch (error) {
    res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
  }
}

//Incoming delete
// module.exports.delete = async (req, res) => {
//   try {
//     const { _id } = req.body

//     const incoming = await Incoming.findById(_id)

//     if (incoming.products.length > 0) {
//       return res.status(400).json({
//         message:
//           "Diqqat! Ushbu bo'limda mahsulotlar mavjud bo'lganligi sababli bo'limni o'chirish mumkin emas.",
//       })
//     }

//     await Incoming.findByIdAndDelete(_id)

//     res.send(incoming)
//   } catch (error) {
//     res.status(501).json({ error: 'Serverda xatolik yuz berdi...' })
//   }
// }