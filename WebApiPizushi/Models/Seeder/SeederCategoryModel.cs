﻿using System.ComponentModel.DataAnnotations;

namespace WebApiPizushi.Models.Seeder
{
    public class SeederCategoryModel
    {
        public string Name { get; set; } = string.Empty;
        public string Image { get; set; } = string.Empty;
        public string Slug { get; set; } = string.Empty;
    }
}
