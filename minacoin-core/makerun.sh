
cmake . -DBUILD_TESTS:BOOL=false -DBUILD_MAIN:BOOL=true -DBUILD_LIB:BOOL=false
make 
./minacoin-core
