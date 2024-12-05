const BANNER_IMAGE = "https://i.hizliresim.com/dgs94o5.png";

function AuthBanner({ testimonial, author, role }) {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-dark-secondary relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-center bg-cover blur-sm opacity-20"
        style={{ backgroundImage: `url(${BANNER_IMAGE})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/30 to-brand-secondary/30" />
      <div className="relative z-10 p-12 flex flex-col justify-between h-full">
        <div>
          <h1 className="text-4xl font-bold text-dark-text mb-4">Taskero</h1>
          <p className="text-xl text-dark-text/80">Modern görev yönetimi platformu</p>
        </div>
        <div className="space-y-6">
          <p className="text-dark-text/90 text-lg">
            {testimonial}
          </p>
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-brand-primary/20" />
            <div>
              <p className="text-dark-text font-medium">{author}</p>
              <p className="text-dark-text/70">{role}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthBanner;
