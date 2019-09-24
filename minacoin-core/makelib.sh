
cmake . -DBUILD_TESTS:BOOL=false -DBUILD_MAIN:BOOL=false -DBUILD_LIB:BOOL=true
make 
sudo cp libminacoin-core.so /usr/lib/
sudo cp libminacoin-core.so.1.0.0 /usr/lib/