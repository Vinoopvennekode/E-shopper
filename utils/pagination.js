const cartModal=require('../model/cartModel')
function paginatedResults(model) {
    return async (req, res, next) => {
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)
     
  
      const startIndex = (page - 1) * limit
      const endIndex = page * limit
  
      const results = {}
      results.current = { page, limit };
     
      if (endIndex < await model.countDocuments().exec()) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      
      if (startIndex > 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }
      try {
        results.results = await model.find().limit(limit).skip(startIndex).exec()
        res.paginatedResults = results
        next()
      } catch (e) {
        res.status(500).json({ message: e.message })
      }
    }
  }


function cartItem(){
  return async (req, res, next) => {
const userId=req.session.user
let cartItem
if(userId){
const cart=await cartModal.findOne({ user: userId }).populate("cartItem.product")
cartItem=cart.cartItem.length
}else{
cartItem=0
}
res.cartItem=cartItem
next()
  }
}

module.exports={paginatedResults,cartItem}
