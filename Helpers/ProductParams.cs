﻿namespace DutchTreat.Helpers
{
    public class ProductParams
    {
        private const int MaxPageSize = 50;
        public int PageNumber { get; set; } = 1;
        private int _pageSize = 10;
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }

        public string OrderBy { get; set; } = "price";
        public string SortOrder { get; set; } = "asc";
        public string FilterByCategory { get; set; } = "allProducts";
    }
}
