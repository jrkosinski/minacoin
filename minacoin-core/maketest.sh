
cmake . -DBUILD_TESTS:BOOL=true -DBUILD_MAIN:BOOL=false -DBUILD_LIB:BOOL=false
make 
./minacoin-core-test
