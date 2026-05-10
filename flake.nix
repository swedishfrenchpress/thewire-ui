{
  description = "Nix flake for the-wire Next.js app";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    { self, nixpkgs }:
    let
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "x86_64-darwin"
        "aarch64-darwin"
      ];

      forAllSystems =
        f:
        nixpkgs.lib.genAttrs systems (
          system:
          f {
            pkgs = import nixpkgs { inherit system; };
          }
        );
    in
    {
      packages = forAllSystems (
        { pkgs }:
        let
          nodejs = pkgs.nodejs_22;
        in
        {
          default = pkgs.buildNpmPackage {
            pname = "the-wire";
            version = "0.1.0";

            src = pkgs.lib.cleanSourceWith {
              src = ./.;
              filter =
                path: type:
                let
                  base = baseNameOf path;
                in
                !(pkgs.lib.elem base [
                  ".git"
                  ".next"
                  "node_modules"
                  "result"
                ]);
            };

            inherit nodejs;
            npmDepsHash = pkgs.lib.fakeHash;

            npmBuildScript = "build";

            nativeBuildInputs = [ pkgs.makeWrapper ];

            installPhase = ''
              runHook preInstall

              mkdir -p "$out/share/the-wire"
              cp -R .next node_modules package.json public "$out/share/the-wire/"

              makeWrapper "$out/share/the-wire/node_modules/.bin/next" "$out/bin/the-wire" \
                --chdir "$out/share/the-wire" \
                --set NODE_ENV production \
                --add-flags "start --hostname 0.0.0.0"

              runHook postInstall
            '';
          };
        }
      );

      apps = forAllSystems (
        { pkgs }:
        {
          default = {
            type = "app";
            program = "${self.packages.${pkgs.system}.default}/bin/the-wire";
          };
        }
      );

      devShells = forAllSystems (
        { pkgs }:
        {
          default = pkgs.mkShell {
            packages = [ pkgs.nodejs_22 ];

            shellHook = ''
              export PATH="$PWD/node_modules/.bin:$PATH"

              echo "Node $(node --version)"
              if ! command -v next >/dev/null 2>&1; then
                echo "Dependencies are not installed. Run npm ci, then npm run dev."
              else
                echo "Run npm run dev."
              fi
            '';
          };
        }
      );
    };
}
