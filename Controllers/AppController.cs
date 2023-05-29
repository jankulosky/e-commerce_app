using DutchTreat.ViewModels;
using DutchTreat.Services;
using Microsoft.AspNetCore.Mvc;
using DutchTreat.Data;
using DutchTreat.Helpers;

namespace DutchTreat.Controllers
{
    public class AppController : Controller
    {
        private readonly IMailService _mailService;
        private readonly DutchContext _ctx;
        private readonly IDutchRepository _repository;

        public AppController(IMailService mailService, DutchContext ctx, IDutchRepository repository)
        {
            _mailService = mailService;
            _ctx = ctx;
            _repository = repository;
        }

        public IActionResult Index()
        {
            return View();
        }
        [HttpGet("contact")]
        public IActionResult Contact()
        {
            ViewBag.Title = "Contact us";

            return View();
        }
        [HttpPost("contact")]
        public IActionResult Contact(ContactViewModel model)
        {
            if (ModelState.IsValid)
            {
                // send the email
                _mailService.SendMessage("viktor@dutchtreat.com", model.Subject, $"From: {model.Name} {model.Email}, Message: {model.Message}");
                ViewBag.UserMessage = "Mail sent";
                ModelState.Clear();
            }
            return View();
        }
        [HttpGet("about")]
        public IActionResult About()
        {
            ViewBag.Title = "About us";

            return View();
        }

        public async Task<IActionResult> Shop(ProductParams productParams)
        {
            var results = await _repository.GetAllProductsAsync(productParams);

            return View(results);
        }
    }
}
