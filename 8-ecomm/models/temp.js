const agg = [
  {
    '$match': {
      'product': new ObjectId('65112840a0018757f3a5aaaa')
    }
  }, {
    '$group': {
      '_id': null, 
      'averageRating': {
        '$avg': '$rating'
      }, 
      'numOfReviews': {
        '$sum': 1
      }
    }
  }
]