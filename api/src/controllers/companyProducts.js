// const companyProducts = async () => {
//     const allCompanyProducts = await CompanyProducts.findAll({
//         attributes: { exclude: ['createdAt', 'updatedAt'] },
//         include: {
//             model: Company,
//             attributes: ['id', 'name'],
//             include: {
//                 model: Users,
//                 attributes: ['id', 'name'],
//             },
//         },
//     });
//     return allCompanyProducts;
// }