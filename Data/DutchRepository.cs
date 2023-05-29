using AutoMapper;
using AutoMapper.QueryableExtensions;
using DutchTreat.Data.Entities;
using DutchTreat.Helpers;
using Microsoft.EntityFrameworkCore;

namespace DutchTreat.Data
{
    public class DutchRepository : IDutchRepository
    {
        private readonly DutchContext _ctx;
        private readonly ILogger<DutchRepository> _logger;
        private readonly IMapper _mapper;

        public DutchRepository(DutchContext ctx, ILogger<DutchRepository> logger, IMapper mapper)
        {

            _ctx = ctx;
            _logger = logger;
            _mapper = mapper;
        }

        public void AddEntity(object model)
        {
            _ctx.Add(model);
        }

        public IEnumerable<Order> GetAllOrders(bool includeItems)
        {
            if (includeItems)
            {
                return _ctx.Orders
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                    .ToList();
            }
            else
            {
                return _ctx.Orders
                    .ToList();
            }
        }

        public IEnumerable<Order> GetAllOrdersByUser(string username, bool includeItems)
        {
            if (includeItems)
            {
                return _ctx.Orders
                    .Where(o => o.User.UserName == username)
                    .Include(o => o.Items)
                    .ThenInclude(i => i.Product)
                    .ToList();
            }
            else
            {
                return _ctx.Orders
                    .Where(o => o.User.UserName == username)
                    .ToList();
            }
        }

        public async Task<PagedList<Product>> GetAllProductsAsync(ProductParams productParams)
        {
            _logger.LogInformation("GetAllProducts was called!");

            var query = _ctx.Products.AsQueryable();

            if (!string.IsNullOrEmpty(productParams.FilterByCategory) && productParams.FilterByCategory.ToLower() != "allproducts")
            {
                query = query.Where(p => p.Category == productParams.FilterByCategory);
            }

            switch (productParams.OrderBy)
            {
                case "price":
                    query = (productParams.SortOrder == "asc")
                        ? query.OrderBy(p => p.Price)
                        : query.OrderByDescending(p => p.Price);
                    break;
                case "name":
                    query = (productParams.SortOrder == "asc")
                        ? query.OrderBy(p => p.Title)
                        : query.OrderByDescending(p => p.Title);
                    break;
                default:
                    break;
            }

            var products = await PagedList<Product>.CreateAsync(query, productParams.PageNumber, productParams.PageSize);

            return products;
        }

        public Order GetOrderById(string username, int id)
        {
            return _ctx.Orders
                .Include(o => o.Items)
                .ThenInclude(i => i.Product)
                .Where(o => o.Id == id && o.User.UserName == username)
                .First();
        }

        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category)
        {
            return await _ctx.Products
                .Where(p => p.Category == category)
                .ToListAsync();
        }

        public bool SaveAll()
        {
            return _ctx.SaveChanges() > 0;
        }
    }
}
