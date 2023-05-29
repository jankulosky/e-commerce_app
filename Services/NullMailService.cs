namespace DutchTreat.Services
{
    public class NullMailService : IMailService
    {
        private readonly ILogger<NullMailService> logger;

        public NullMailService(ILogger<NullMailService> logger)
        {
            this.logger = logger;
        }


        public void SendMessage(string to, string subject, string body)
        {
            // log the message
            logger.LogInformation($"To: {to} Subject: {subject} Body: {body}");
        }
    }
}
