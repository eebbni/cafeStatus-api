const {Cafe} = require('../model');
const {Brand} = require('../model');

//전체 카페 보기
exports.CafeList = async (req, res) => {
    try {
      const result = await Cafe.findAll({
        order:[
          ['id','ASC']
        ]
      });
      res.render('cafe/list', {data : result});
    } catch (e) {
      res.status(404).send("카페 리스트가 없습니다.");
    }
  }

//카페 상세보기
exports.CafeDetail = async (req, res) => {
  try {
    const { cafeId } = req.params;
    const result = await Cafe.findAll({ 
      where: { id: cafeId },
      order:[
        ['id','ASC']
      ]
    });
    res.render('cafe/detail', {data : result});
  } catch (e) {
    res.status(404).send("해당 이름의 카페가 없습니다.");
  }
}

//현재 오픈한 카페 보기
exports.CafeOpenList = async (req, res) => {
  try {
    const result = await Cafe.findAll({ 
      where: { status: 'OPEN' },
      order:[
        ['id','ASC']
      ]
    });
    res.render('cafe/detail', {data : result});
  } catch (e) {
    res.status(404).send("현재 오픈한 카페가 없습니다.");
  }
}

//카페 추가 하기
exports.CafeInsert = async (req, res) => {
  try {
    const { brandId } = req.params;
    const { location, name, operatingtimeS ,operatingtimeE,content,status} = req.body;
    backURL=req.header('Referer') || '/'; //이전페이지
    const brand = await Brand.findByPk(brandId);
    //없는 브랜드의 번호면 할일 추가 안함
    if(!brand)
    {
      throw new Error("등록되지 않은 브랜드id 입니다.");
    }
    const ret = await Cafe.create({
      brandId  : brandId,
      location : location,
      name : name,
      operatingtimeS : operatingtimeS,
      operatingtimeE : operatingtimeE,
      content : content,
      status : status
    }, {logging: false});

    await brand.addCafe(ret);
    const newData = ret.dataValues;
    console.log(newData);
    console.log('Create success');
    res.redirect(backURL); 
  }
  catch (error) {
    console.log('Error : ', error);
    res.json("카페 insert 실패사유 : "+ error);
  }
}

//카페 상태(status) open/close 수정
exports.CafeStatusUpdate = async (req, res) => {
  try {
    if(!req.body)
    {
        throw "상태값이 입력되지 않았습니다.";
    }
    const { cafeId } = req.params;
    const { status} = req.body;
    let result = await Cafe.update(
        { status: status},
        { where: { id: cafeId }});
    console.log('Modify success :', result);
    res.send("카페 상태 수정 성공");
  }
  catch (error) {
    console.log('Error :', error);
    res.json("카페 상태 수정 실패");
  }
}

//카페 삭제
exports.CafeDelete = async (req, res) => {
  try {
    if(!req.params)
    {
        throw "삭제할 카페 아이디가 입력되지 않았습니다.";
    }
    const { cafeId } = req.params;
    let result = await Cafe.destroy(
        { where: { id: cafeId }});
    console.log('delete sucess', result);
    res.redirect('/cafe/cafelist');
  }
  catch (error) {
    console.log('Error :', error);
    res.json("카페 삭제 실패");
  }
}