using DutchTreat.Data.Entities;
using DutchTreat.Helpers;

namespace DutchTreat.Data
{
    public interface IDutchRepository
    {
        Task<PagedList<Product>> GetAllProductsAsync(ProductParams productParams);
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(string category);
        IEnumerable<Order> GetAllOrders(bool includeItems);
        IEnumerable<Order> GetAllOrdersByUser(string username, bool includeItems);
        Order GetOrderById(string username, int id);
        bool SaveAll();
        void AddEntity(object model);
    }
}